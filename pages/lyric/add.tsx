import {Badge, Button, Form, Input} from "antd";
import {NextPage} from "next";
import {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";
import withAuth from "../../components/with-auth";
import withNotification from "../../components/with-notification";
import {LoggingUserInfo, LyricRequest} from "../../types/account";
import {NotificationProps} from "../../types/page";
import styles from "./styles/index.module.scss";
import classNames from "classnames";
import TextEditor from "../../components/core/TextEditor";
import {Rule} from "rc-field-form/lib/interface";
import {arrayToString, getNumber, stringToArray} from "../../utils/utils";
import TagsInput from "../../components/core/TagsInput";
import LyricLayout from "../../layouts/LyricLayout";
import {LyricDetailResponse} from "../../types/lyric";
import LyricPreview from "../../components/lyric/components/LyricPreview";
import {LyricStatuses} from "../../apis/lyric-apis";
import {DraftStyleMap} from "draft-js";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {addLyric, editLyric, LyricActionStatus} from "../../redux/reducers/lyric/lyricActionSlice";
import getTranslation from "../../components/translations";
import ConfirmModal from "../../components/core/modals/ConfirmModal";
import {getUserInfo} from "../../services/auth_services";
import Head from "next/head";

const MAXIMUM_CONTENT_CHAR_COUNT = 9000;

const MAXIMUM_DESCRIPTION_CHAR_COUNT = 5000;

const MINIMUM_CONTENT_CHAR_COUNT = 100;

const MAXIMUM_CONTENT_LINE_COUNT = 300;

const MAXIMUM_DESCRIPTION_LINE_COUNT = 200;

const MAXIMUM_IMAGE_COUNT = 10;

const MAXIMUM_VIDEO_LINK_COUNT = 10;

const MAXIMUM_ARRAY_NAME_LENGTH = 3;

export const SPECIAL_CHARS_REGEX = /[`~<>;'"/[\]{}=]/;

interface RichFormFieldSharp {
    value: string,
    count: number,
    line: number,
    imageCount: number,
    videoUrlCount: number,
    disableImage: boolean,
    disableVideo: boolean
}

interface CountLineProps {
    field: RichFormFieldSharp,
    isCountValid: boolean,
    isLineValid: boolean,
    isVideoUrlCountValid: boolean,
    isImageCountValid: boolean,
    locale: string | undefined
}

interface FormSharp {
    title: string;
    content: RichFormFieldSharp;
    description?: RichFormFieldSharp;
    composers?: string[];
    singers?: string[];
    owners?: string[];
}

interface FormRuleSharp {
    title: Rule[];
    content: Rule[];
    description?: Rule[];
    composers?: Rule[];
    singers?: Rule[];
    owners?: Rule[];
}

enum AddStatus  {
    INITIAL,
    PREVIEW,
    BACK,
    SAVED,
    EDIT,
    BEGIN
}

const richTextValidator = (locale: string | undefined, value: RichFormFieldSharp, minChar: number, maxChar: number, maxLine: number): any[] => {

    const error = [];
    const PRE_TRANS_KEY = "lyric.validation.";
    if (value.count < minChar) {
        const key = PRE_TRANS_KEY + "inputMinimum";
        const defaultValue = `You must input at least ${minChar} characters.`;
        error.push([getTranslation(key,defaultValue,locale, minChar)]);
    }
    if (value.count > maxChar) {
        const key = PRE_TRANS_KEY + "inputMaximum";
        const defaultValue = `You can't input more than ${maxChar} characters.`;
        error.push([getTranslation(key,defaultValue,locale, maxChar)]);
    }
    if (value.line > maxLine) {
        const key = PRE_TRANS_KEY + "inputMaximum";
        const defaultValue = `You can't input more than ${maxLine} lines.`;
        error.push(getTranslation(key,defaultValue,locale, maxLine));
    }
    if (!value.disableImage && value.imageCount > MAXIMUM_IMAGE_COUNT) {
        const key = PRE_TRANS_KEY + "imageMaximum";
        const defaultValue = `You can't add more than ${MAXIMUM_IMAGE_COUNT} images.`;
        error.push(getTranslation(key,defaultValue,locale, MAXIMUM_IMAGE_COUNT));
    }
    if (!value.disableVideo && value.videoUrlCount > MAXIMUM_VIDEO_LINK_COUNT) {
        const key = PRE_TRANS_KEY + "videoMaximum";
        const defaultValue = `You can't add more than ${MAXIMUM_VIDEO_LINK_COUNT} video links.`;
        error.push(`You can't input more than ${MAXIMUM_VIDEO_LINK_COUNT} video links.`);
        error.push(getTranslation(key,defaultValue,locale, MAXIMUM_VIDEO_LINK_COUNT));
    }

    return error;
}

const contentValidator = (locale: string | undefined, rule: Rule, value: RichFormFieldSharp, callback: any) => {
    if (!value || !value.value) {
        callback(getTranslation("lyric.validation.content.required", "Please input your content!",locale));
    } else {
        callback(richTextValidator(locale, value, MINIMUM_CONTENT_CHAR_COUNT, MAXIMUM_CONTENT_CHAR_COUNT, MAXIMUM_CONTENT_LINE_COUNT));
    }
}

const descriptionValidator = (locale: string | undefined, rule: Rule, value: RichFormFieldSharp, callback: any) => {
    if (value && value.value && value.count) {
        callback(richTextValidator(locale, value, MINIMUM_CONTENT_CHAR_COUNT, MAXIMUM_DESCRIPTION_CHAR_COUNT, MAXIMUM_DESCRIPTION_LINE_COUNT));
    } else {
        callback([]);
    }
}

const createRule = (locale: string | undefined): FormRuleSharp => {
    return {
        title: [
            { required: true, message: getTranslation("lyric.validation.title.required", "Please input your lyric title!", locale) },
            { min: 2, message: getTranslation("lyric.validation.title.min", "Title must contain at least 2 characters.", locale, 2)},
            { max: 250, message: getTranslation("lyric.validation.title.max", "Title must contain less than 250 characters.", locale, 250)},
            {validator: (rule,value,callback) => {
                    if (value && SPECIAL_CHARS_REGEX.test(value)) {
                        callback(getTranslation("lyric.validation.title.valid", "Title cannot contain any special characters.", locale));
                    } else {
                        callback([] as any);
                    }
            }}
        ],
        content: [
            { required: true, message: getTranslation("lyric.validation.content.required", "Please input your content!",locale) },
            {validator: (rule,value,callback) => contentValidator(locale, rule, value, callback)}
        ],
        description: [
            {validator: (rule,value,callback) => descriptionValidator(locale, rule, value, callback)}
        ]
    }
}

const CountLine: React.FC<CountLineProps> = (props: CountLineProps) => {
    const {field, isCountValid, isLineValid, isVideoUrlCountValid, isImageCountValid, locale} = props;
    return <div className={styles.field_info}>
        <div className={styles.__line}>
            <span className={classNames({"error_color": !isCountValid})} hidden={!field.count}>{getTranslation("lyric.count", "Count", locale)}:</span>
            <Badge className={classNames({[styles.__valid]: isCountValid})} count={field.count} overflowCount={999999}/></div>
        <div className={styles.__line}>
            <span className={classNames({"error_color": !isLineValid})} hidden={!field.line}>{getTranslation("lyric.line","Line",locale)}:</span>
            <Badge className={classNames({[styles.__valid]: isLineValid})} count={field.line} overflowCount={999999}/></div>
        {!field.disableImage && <div className={styles.__line}>
            <span className={classNames({"error_color": !isImageCountValid})} hidden={!field.imageCount}>{getTranslation("lyric.image","Image",locale)}:</span>
            <Badge className={classNames({[styles.__valid]: isImageCountValid})} count={field.imageCount} overflowCount={999999}/></div>}
        {!field.disableVideo && <div className={styles.__line}>
            <span className={classNames({"error_color": !isVideoUrlCountValid})} hidden={!field.videoUrlCount}>{getTranslation("lyric.video","Video",locale)}:</span>
            <Badge className={classNames({[styles.__valid]: isVideoUrlCountValid})} count={field.videoUrlCount} overflowCount={999999}/></div>}
    </div>
}

const formValuesToRequest = (values: FormSharp, user: LoggingUserInfo): LyricRequest => {
    return {
        title: values.title,
        description: values.description ? values.description.value: '',
        content: values.content ?  values.content.value: '',
        owners: arrayToString(values.owners),
        composers: arrayToString(values.composers),
        singers: arrayToString(values.singers),
        status: LyricStatuses.HIDDEN,
        accountId: user.id
    }
}

const AddingLyricPage: NextPage<LyricPageProps> = (props: LyricPageProps) => {
    const {onSuccess, onErrors} = props;
    const dispatch = useDispatch();
    const {isLoad, actionStatus, detail} = useSelector((state: RootState) => state.lyric.actions);
    const [status, setStatus] = React.useState(AddStatus.INITIAL);
    const router = useRouter();
    const {locale} = router;
    const [form] = Form.useForm();
    const [content, setContent] = React.useState<RichFormFieldSharp>({
        value: '',
        count: 0,
        line: 0,
        imageCount: 0,
        videoUrlCount: 0,
        disableImage: true,
        disableVideo: true
    });
    const [description, setDescription] = React.useState<RichFormFieldSharp>({
        value: '',
        count: 0,
        line: 0,
        imageCount: 0,
        videoUrlCount: 0,
        disableImage: false,
        disableVideo: false
    });
    const [previewData, setPreviewData] = useState<LyricDetailResponse | null>(null);
    const [isTouched, setIsTouched] = useState(false);
    const rule = useMemo(() => createRule(locale),[locale]);
    const [loggInUserInfo, setLoggInUserInfo] = useState<LoggingUserInfo | null>(null);
    const [contentStyleMap, setContentStyleMap] = useState<DraftStyleMap>({});
    const [descriptionStyleMap, setDescriptionStyleMap] = useState<DraftStyleMap>({});
    const [composers, setComposers] = useState<string[]>([]);
    const [singers, setSingers] = useState<string[]>([]);
    const [owners, setOwners] = useState<string[]>([]);
    const [formValues, setFormValues] = useState<FormSharp| null>(null);
    const [shouldConfirm, setShouldConfirm] = useState(false);

    const extraValidations = () => {
        !isTouched && setIsTouched(true);
        if (content.imageCount > 0 || content.videoUrlCount > 0) {
            onErrors && onErrors("Content must not contain images or videos.");
            return;
        }
    }

    const setFieldsStates = (values: FormSharp, status: AddStatus) => {
        extraValidations();
        values.composers && values.composers.length > 0 && setComposers(values.composers);
        values.singers && values.singers.length > 0 && setSingers(values.singers);
        values.owners && values.owners.length > 0 && setOwners(values.owners);
        setStatus(status);
    }

    const onFinish = (values: FormSharp) => {
        handleSave(values);
    };

    const onFinishFailed = (errorInfo: any) => {
        !isTouched && setIsTouched(true);
    };

    const isContentCountValid = useMemo(() => content.count >= MINIMUM_CONTENT_CHAR_COUNT && content.count <= MAXIMUM_CONTENT_CHAR_COUNT, [content]);
    const isContentLineValid = useMemo(() => content.line <= MAXIMUM_CONTENT_LINE_COUNT, [content]);

    const isDescriptionCountValid = useMemo(() => description.count >= MINIMUM_CONTENT_CHAR_COUNT && description.count <= MAXIMUM_DESCRIPTION_CHAR_COUNT, [description]);
    const isDescriptionLineValid = useMemo(() => description.line <= MAXIMUM_DESCRIPTION_LINE_COUNT, [description]);
    const isDescriptionImageCountValid = useMemo(() => description.imageCount <= MAXIMUM_IMAGE_COUNT, [description]);
    const isDescriptionVideoUrlCountValid = useMemo(() => description.videoUrlCount <= MAXIMUM_VIDEO_LINK_COUNT, [description]);

    const handlePreview = () => {
        form.validateFields().then((values: FormSharp) => {
            setFieldsStates(values, AddStatus.PREVIEW);
            setFormValues(values);
            loggInUserInfo && setPreviewData({
                account_info: {
                    name: loggInUserInfo.name,
                    total_rate: 999,
                    lyric_number: 999,
                    photo_url: loggInUserInfo.photoUrl,
                    email: loggInUserInfo.email,
                    username: loggInUserInfo.username,
                    id: loggInUserInfo.id
                },
                is_rated: false,
                comment: {
                    comments: [],
                    total: 0,
                    has_next: false
                },
                content: values.content ? values.content.value: '',
                description: values.description? values.description.value: '',
                composers: arrayToString(values.composers),
                current_owners:  arrayToString(values.owners),
                id: 111,
                is_deleted: false,
                singers: arrayToString(values.singers),
                status: LyricStatuses.PUBLISH,
                title: values.title,
                created_date: new Date().toString(),
                updated_date: new Date().toString(),
                rate: 5,
            });
        }).catch(err => onErrors && onErrors(err));
    }

    const handlePublish = () => {
        loggInUserInfo && form.validateFields().then((values) => {
            setFieldsStates(values, AddStatus.SAVED);
            const req = formValuesToRequest(values, loggInUserInfo);
            req.status = LyricStatuses.PUBLISH;
            if (!detail)
                dispatch(addLyric({
                    request: req,
                    isSave: false,
                    locale
                }));
            else
                dispatch(editLyric({
                    lyricId: detail.id,
                    request: req,
                    isSave: false,
                    locale
                }));
        }).catch(err => onErrors && onErrors(err));
    }

    const handleSaveAfterPreview = () => {
        handleSave(formValues);
    }

    const handleSave = (values: FormSharp | null, isConfirm?: boolean) => {
        if (!isConfirm && detail && detail.status === LyricStatuses.PUBLISH) {
            setShouldConfirm(true);
            return;
        }
        if (values && loggInUserInfo) {
            setFieldsStates(values, AddStatus.SAVED);
            const req = formValuesToRequest(values, loggInUserInfo);
            if (!detail)
                dispatch(addLyric({
                    request: req,
                    isSave: true,
                    locale
                }));
            else
                dispatch(editLyric({
                    lyricId: detail.id,
                    request: req,
                    isSave: true,
                    locale
                }));
        }
        shouldConfirm && setShouldConfirm(false);
    }

    const handlePublishAfterPreview = () => {
        if (formValues && loggInUserInfo) {
            setFieldsStates(formValues, AddStatus.SAVED);
            const req = formValuesToRequest(formValues, loggInUserInfo);
            req.status = LyricStatuses.PUBLISH;
            if (!detail)
                dispatch(addLyric({
                    request: req,
                    isSave: false,
                    locale
                }));
            else
                dispatch(editLyric({
                    lyricId: detail.id,
                    request: req,
                    isSave: false,
                    locale
                }));
        }
    }

    const handleBack = () => {
        setPreviewData(null);
        setStatus(AddStatus.BACK);
    }

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            left: 0
        })
    }

    const shouldInitial = useMemo(() => status === AddStatus.BACK || status === AddStatus.EDIT, [status]);

    useMemo(() => {
        if (!form) return;
        if (!isContentCountValid) {
        } else {

        }
    },[form, isContentCountValid]);

    const title = useMemo(() => {
        return [!detail ? getTranslation( "lyric.layout.header.newBtn", "Create New Lyric", locale): getTranslation("lyric.button.edit", "Edit", locale) + ` ${detail.title}`,
            getTranslation("lyric.slogan", "Save your lyric for free", locale)]
            .join(" | ")
    },[locale, detail]);

    useEffect(() => {
        if (actionStatus === LyricActionStatus.SAVED) {
            router.push("/lyric/list").then(() => {
                !detail && onSuccess && onSuccess(
                    getTranslation("lyric.notification.lyricCreateSuccess", "Lyric has been created successfully!", locale));
                detail && onSuccess && onSuccess(
                    getTranslation("lyric.notification.lyricEditSuccess", "Lyric has been updated successfully!", locale));
            });
        } else if (actionStatus === LyricActionStatus.PUBLISHED) {
            router.push("/lyric").then(() => {
                !detail && onSuccess && onSuccess(getTranslation("lyric.notification.lyricCreateAndPublicSuccess", "Lyric has been created and published successfully!", locale));
                detail && onSuccess && onSuccess(getTranslation("lyric.notification.lyricEditAndPublicSuccess", "Lyric has been updated and published successfully!", locale));
            });
        }

    },[actionStatus]);

    useEffect(() => {
        setLoggInUserInfo(getUserInfo());
    }, []);


    useEffect(() => {
        if (status === AddStatus.BACK) {
            scrollToTop();
            setStatus(AddStatus.BEGIN);
        }
        if (status === AddStatus.PREVIEW) {
            scrollToTop();
        }
    },[status]);

    useEffect(() => {
        if (detail) {
            const values: FormSharp = {
                owners: stringToArray(detail.owners),
                singers: stringToArray(detail.singers),
                composers: stringToArray(detail.composers),
                title: detail.title,
                description: {
                    value: detail.description ? detail.description : '',
                    count: 0,
                    line: 0,
                    imageCount: 0,
                    videoUrlCount: 0,
                    disableImage: false,
                    disableVideo: false
                },
                content: {
                    value: detail.content ? detail.content: '',
                    count: 0,
                    line: 0,
                    imageCount: 0,
                    videoUrlCount: 0,
                    disableImage: true,
                    disableVideo: true
                }
            }
            form.setFieldsValue(values);
            setComposers(values.composers ? values.composers: []);
            setOwners(values.owners ? values.owners: []);
            setSingers(values.singers ? values.singers: []);
            setContent(values.content);
            setDescription(values.description ? values.description: {
                value: '',
                count: 0,
                line: 0,
                imageCount: 0,
                videoUrlCount: 0,
                disableImage: true,
                disableVideo: true
            });
            setStatus(AddStatus.EDIT);
            setFormValues(values);
        }

        return () => {
            form.resetFields();
        }
    },[detail]);

    return <LyricLayout>
        <Head>
            <title>{title}</title>
        </Head>
        {previewData == null && <div className = {classNames("center-1", styles.wrapper)}>
            {rule && <Form
                name="lyric"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                form={form}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout={"vertical"}
            >
                <Form.Item
                    label={getTranslation("lyric.title", "Lyric Title", locale)}
                    name="title"
                    wrapperCol={{span: 8}}
                    rules={rule.title}
                >
                    <Input />
                </Form.Item>
                <Form.Item label={getTranslation("lyric.detail.composers", "Composers", locale)} name="composers">
                    <div>
                        <TagsInput
                            max={MAXIMUM_ARRAY_NAME_LENGTH}
                            placeholder={getTranslation("lyric.addComposer", "Add Composer", locale)}
                            maxLength={250}
                            name={getTranslation("lyric.composer", "Composer", locale)}
                            initialValue={shouldInitial && composers.length > 0 ? composers: []}
                            onChange={tags => {
                            form.setFieldsValue({
                                composers: tags.length > 0? tags: null
                            });}}
                            locale={locale}
                        />
                    </div>
                </Form.Item>
                <Form.Item label={getTranslation("lyric.detail.singers", "Singers", locale)} name="singers">
                    <div>
                        <TagsInput
                            max={MAXIMUM_ARRAY_NAME_LENGTH}
                            placeholder={getTranslation("lyric.addSinger", "Add Singer", locale)}
                            maxLength={250}
                            name={getTranslation("lyric.singer", "Singer", locale)}
                            initialValue={shouldInitial && singers.length > 0 ? singers: []}
                            onChange={tags => {
                            form.setFieldsValue({
                                singers: tags.length > 0? tags: null
                            });
                            }}
                            locale={locale}
                        />
                    </div>
                </Form.Item>
                <Form.Item label={getTranslation("lyric.detail.owners", "Current Owners", locale)} name="owners">
                    <div>
                        <TagsInput
                            max={MAXIMUM_ARRAY_NAME_LENGTH}
                            placeholder={getTranslation("lyric.addOwner", "Add Owner", locale)}
                            maxLength={250}
                            name={getTranslation("lyric.owner", "Owner", locale)}
                            initialValue={shouldInitial && owners.length > 0 ? owners: []}
                            onChange={tags => {
                            form.setFieldsValue({
                                owners: tags.length > 0? tags: null
                            });}}
                            locale={locale}
                        />
                    </div>
                </Form.Item>
                <Form.Item label={getTranslation("lyric.content", "Content", locale)} name="content" rules={rule.content}>
                    <ul>
                        <li>{getTranslation("lyric.contentNote.line1_1", "You must input at least ", locale)}
                            <b>{MINIMUM_CONTENT_CHAR_COUNT}</b>
                            {getTranslation("lyric.contentNote.line1_2", " characters.", locale)}</li>
                        <li>{getTranslation("lyric.contentNote.line2_1","You couldn't input more than ", locale)}
                            <b>{MAXIMUM_CONTENT_CHAR_COUNT}</b>
                            {getTranslation("lyric.contentNote.line2_2"," characters and have more than ", locale)}
                            <b>{MAXIMUM_CONTENT_LINE_COUNT}</b>
                            {getTranslation("lyric.contentNote.line2_3"," lines.", locale)}
                        </li>
                    </ul>
                    <TextEditor
                        size="md"
                        minChar={MINIMUM_CONTENT_CHAR_COUNT}
                        lineLimit={MAXIMUM_CONTENT_LINE_COUNT}
                        charLimit={MAXIMUM_CONTENT_CHAR_COUNT}
                        disableVideo={content.disableVideo}
                        disableImage={content.disableImage}
                        initialValue={formValues ? formValues.content?.value: detail ? detail.content: null}
                        customStyleMap={contentStyleMap}
                        onNewCustomStyleMap={styleMap => {
                            setContentStyleMap({...contentStyleMap, ...styleMap});
                        }}
                        onTextChange={(value, count, line, imageCount, videoUrlCount) => {
                            setContent({...content, value, count: getNumber(count),
                                line: getNumber(line),
                                imageCount: getNumber(imageCount), videoUrlCount: getNumber(videoUrlCount)});

                            form.setFieldsValue({
                                content: content
                            });
                            isTouched && form.validateFields(["content"]).then().catch(err => err);
                        }
                        }
                    />
                    <CountLine field={content}
                               isCountValid={isContentCountValid}
                               isLineValid={isContentLineValid}
                               isImageCountValid={true}
                               isVideoUrlCountValid={true}
                               locale = {locale}
                    />
                </Form.Item>
                <Form.Item label={getTranslation("lyric.description", "Description", locale)} name="description" rules={rule.description} className={styles.formWrapper}>
                    <div>
                        <ul>
                            <li>{getTranslation("lyric.descriptionNote.line1_1","You couldn't input more than ", locale)}
                                <b>{MAXIMUM_CONTENT_CHAR_COUNT}</b>
                                {getTranslation("lyric.descriptionNote.line1_2"," characters and have more than ", locale)}
                                <b>{MAXIMUM_CONTENT_LINE_COUNT}</b>
                                {getTranslation("lyric.descriptionNote.line1_3"," lines.", locale)}
                            </li>
                            <li>{getTranslation("lyric.descriptionNote.line2_1","You can add ", locale)}
                                <b>{MAXIMUM_IMAGE_COUNT}</b>{getTranslation("lyric.descriptionNote.line2_2"," pictures and ", locale)}
                                <b>{MAXIMUM_VIDEO_LINK_COUNT}</b>{getTranslation("lyric.descriptionNote.line2_3"," video links.", locale)}</li>
                        </ul>
                        <TextEditor
                            size="md"
                            minChar={MINIMUM_CONTENT_CHAR_COUNT}
                            lineLimit={MAXIMUM_DESCRIPTION_LINE_COUNT}
                            charLimit={MAXIMUM_DESCRIPTION_CHAR_COUNT}
                            disableVideo={description.disableVideo}
                            disableImage={description.disableImage}
                            customKey={"editor-description"}
                            initialValue={formValues ? formValues.description ? formValues.description.value ? formValues.description.value: null : null: detail ? detail.description: null}
                            customStyleMap={descriptionStyleMap}
                            onNewCustomStyleMap={styleMap => {
                                setDescriptionStyleMap({...descriptionStyleMap, ...styleMap});
                            }}
                            onTextChange={(value, count, line, imageCount, videoUrlCount) => {
                                setDescription({...description, value, count: getNumber(count),
                                    line: getNumber(line),
                                    imageCount: getNumber(imageCount), videoUrlCount: getNumber(videoUrlCount)});
                                form.setFieldsValue({
                                    description: description
                                });
                                isTouched && form.validateFields(["description"]).then().catch(err => err);
                            }
                            }
                        />
                        <CountLine field={description}
                                   isCountValid={isDescriptionCountValid}
                                   isLineValid={isDescriptionLineValid}
                                   isImageCountValid={isDescriptionImageCountValid}
                                   isVideoUrlCountValid={isDescriptionVideoUrlCountValid}
                                   locale = {locale}
                        />
                    </div>
                </Form.Item>
                <Form.Item className={styles.formWrapper}>
                    <div className={styles.buttonWrapper}>
                        <Button type="primary" htmlType="submit" disabled ={isLoad}>
                            {getTranslation("lyric.button.save","Save (Private)",locale)}
                        </Button>
                        <Button type="default" htmlType="button" onClick={handlePreview} disabled ={isLoad}>
                            {getTranslation("lyric.button.preview","Preview",locale)}
                        </Button>
                        <Button type="primary" style={{background: '#52c41a', borderColor: '#52c41a'}} htmlType="button" onClick={handlePublish} disabled ={isLoad}>
                            {!detail && getTranslation("lyric.button.publish","Publish",locale)}
                            {detail && getTranslation("lyric.button.saveAndPublish","Save and Publish",locale)}
                        </Button>
                    </div>

                </Form.Item>
            </Form>}
        </div>}
        {previewData != null && <React.Fragment>
            <LyricPreview lyricDetail={previewData} locale={locale}/>
            <div className={styles.buttonWrapper}>
                <Button type="default" htmlType="button" onClick={handleBack} disabled ={isLoad}>
                    {getTranslation("lyric.button.back","Back",locale)}
                </Button>
                <Button type="primary" htmlType="button" onClick={handleSaveAfterPreview} disabled ={isLoad}>
                    {getTranslation("lyric.button.save","Save (Private)",locale)}
                </Button>
                <Button type="primary" style={{background: '#52c41a', borderColor: '#52c41a'}} htmlType="button" onClick={handlePublishAfterPreview} disabled ={isLoad}>
                    {getTranslation("lyric.button.publish","Publish",locale)}
                </Button>
            </div>
        </React.Fragment>}
        {detail && detail.status === LyricStatuses.PUBLISH && <ConfirmModal visible={shouldConfirm}
                      onCancel={() => setShouldConfirm(false)}
                      onOk={() => handleSave(formValues, true)}
                      description={getTranslation("lyric.notification.alreadyPublic","This lyric is on public mode. Do you want to switch to private mode?", locale)}
                      locale={locale}/>}
    </LyricLayout>
}

interface LyricPageProps extends NotificationProps {
   children?: any;
}

export default withNotification(withAuth(AddingLyricPage));