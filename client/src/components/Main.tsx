import { Container, Stack } from "react-bootstrap";
import Header from "./Header";

interface MainProps {
    header?: boolean
    children: React.ReactNode
}

export default function Main(props: MainProps) {
    // console.log(props)
    return (
        <Stack>
            {props.header && <Header/>}
            <Container>
                {props.children}
            </Container>
        </Stack>
    )
}