import { useParams } from "react-router-dom";
import Main from "../components/Main";

export default function FilePage() {
    const {id} =  useParams();

    return (
        <Main header>
            <p>This is a file Page</p>
            <p>File number is {id}</p>
        </Main>
    )
}