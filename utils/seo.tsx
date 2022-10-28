
export const getMetaTitleTag = (content: string) => {

    return <meta content={content} itemProp="headline" property="og:title"/>
}

export const getMetaUrlTag = (url: string) => {

    return <meta property="og:url" itemProp="url" content={url}/>
}