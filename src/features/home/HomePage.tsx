import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";

export default function HomePage(){
    return(
        <Segment vertical className='mhead' >
           <Container text>
            <Header as='h2' inverted>
            <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom:12}}/>
            First Project
            </Header>
            <Button as ={Link} to='/activities' size='huge' inverted>
                To Activities!
            </Button>
              
           </Container>
        </Segment>

    )
}