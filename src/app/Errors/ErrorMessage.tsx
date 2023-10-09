import { Message, MessageItem } from "semantic-ui-react";
import { useStore } from "../Stores/rootStore";
import { observer } from "mobx-react-lite";

interface Props{
    errors:string[];
}

function ErrorMessage() {
    const { activityStore } = useStore();

    return (
        <Message error>
            {activityStore.errors && activityStore.errors.length > 0 && (
                <Message.List>
                    {activityStore.errors.map((err: string, i) => {
                        console.log(`Error array ${i}:`, err); // Log the error
                        return <Message.Item key={i}>{err}</Message.Item>;
                    })}
                </Message.List>
            )}
        </Message>
    );
}

export default observer(ErrorMessage);