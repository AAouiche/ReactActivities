import { Dimmer, Loader } from "semantic-ui-react";

interface Props{
    inverted?: boolean;
    content?: string
}

export default function LoadingComponent({inverted = true, content = 'loading'}:Props){
    return(
        <Dimmer active inverted style={{ position: 'fixed', zIndex: 1000 }}>
      <Loader content={content} />
    </Dimmer>
        
    )
}