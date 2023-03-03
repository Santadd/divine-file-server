import Container from 'react-bootstrap/Container';

interface BodyProps {
    children : React.ReactNode;
}

export default function Body(props: BodyProps) {
    console.log(props)
    return (
        <Container className="Body">
            {props.children}
        </Container>
    )
}