import {CommentDataType, CommentType} from "./reducers/lyric/lyricCommentSlice";
import {LyricCommentItem} from "../types/lyric";

export const transferCommentData = (beginId: number, res: CommentDataType[]): CommentType[] => {
    const items = res.map((item, index) => {
        const child = {
            id: beginId + index + 200000,
            createdDate: new Date(),
            updatedDate: new Date(),
            isAnonymous: false,
            account: {
                id: beginId + index + 1000000,
                email: item.email,
                username: item.name.title + "- " + (beginId + index + 200000),
                avatar: item.picture.large
            },
            content: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).`,
            likes: Math.floor(Math.random() * 100) + 1
        }
        return {
            id: beginId + index + 1,
            createdDate: new Date(),
            updatedDate: new Date(),
            isAnonymous: false,
            account: {
                id: beginId + index + 100000,
                email: item.email,
                username: item.name.title + "- " + (beginId + index + 1),
                avatar: item.picture.large
            },
            content: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).`,
            likes: Math.floor(Math.random() * 100) + 1,
            comments: [child],
            showComments: [child],
            showCommentIndex: 0
        } as CommentType;
    });

    const i = items[items.length - 1];
    i.comments = [];
    for (let index = res.length - 1; index < (res.length+ 20); index++) {
        const child = {
            id: beginId + index + 200000,
            createdDate: new Date(),
            updatedDate: new Date(),
            isAnonymous: false,
            account: {
                id: beginId + index + 1000000,
                email: i.account.email,
                username: i.account.username + "- " + (beginId + index + 200000),
                avatar: i.account.avatar
            },
            content: `We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure).`,
            likes: Math.floor(Math.random() * 100) + 1,
            comments: [],
            showComments: [],
            showCommentIndex: null,
            isShowComments: false
        } as CommentType;
        i.comments && i.comments.push(child);
    }
    i.showComments = [];
    if (i.comments) {
        i.showComments = [...i.comments.slice(i.comments.length - 5)];
        i.showCommentIndex = i.comments.length - 5;
    }

    return items;
}