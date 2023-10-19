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
            <Button as ={Link} to='/login' size='huge' inverted>
                Login
            </Button>
            <Button as ={Link} to='/register' size='huge' inverted>
                Register
            </Button>
              
           </Container>
        </Segment>

    )
}