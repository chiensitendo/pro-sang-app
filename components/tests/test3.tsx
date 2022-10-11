import {NextPage} from "next";
import styles from "../../pages/lyric/styles/test.module.scss";
import LyricLayout from "../../layouts/LyricLayout";
import TextEditor from "../core/TextEditor";
import {UploadFile} from "antd/lib/upload/interface";
import {getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {fireBaseDatabase, fireBaseStorage, LYRIC_TEMP_PICTURE_BUCK} from "../../firebaseConfig";
import {addDoc, collection} from "@firebase/firestore";
import {useLoading} from "../core/useLoading";
import ChatTextEditor from "../core/ChatTextEditor";


const TestPage3: NextPage = () => {


    return <LyricLayout>
        <div className={styles.wrapper}>
            <TextEditor/>
            <ChatTextEditor/>
        </div>
    </LyricLayout>
};

export default TestPage3;