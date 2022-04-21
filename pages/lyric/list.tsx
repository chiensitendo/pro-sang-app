import { NextPage } from "next";
import withNotification from "../../components/with-notification";
import { NotificationProps } from "../../types/page";

const LyricListPage: NextPage = (props: LyricListPageProps) => {
    
    return <div></div>
}

interface LyricListPageProps extends NotificationProps {
    children?: any; 
 }

export default withNotification(LyricListPage);