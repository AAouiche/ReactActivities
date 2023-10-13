import { observer } from "mobx-react-lite";
import { useStore } from "../Stores/rootStore";

const Debug = observer(() => {
    const { userStore } = useStore();
    console.log("DebugComponent re-rendered");
    return (
      <div>
        Current User: {userStore.user?.username || "Not logged in"}
      </div>
    );
  });

export default Debug;