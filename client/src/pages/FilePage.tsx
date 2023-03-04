import { useParams } from "react-router-dom";
import Main from "../components/Main";

export default function FilePage() {
    const {id} =  useParams();

    return (
        <Main header>
            <p>This is its id {id}</p>
        </Main>
    )
}