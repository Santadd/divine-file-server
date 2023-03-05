import { useParams } from "react-router-dom";
import Main from "../components/Main";
import React from "react"
import { useApi } from "../contexts/ApiProvider";
import { Spinner } from "react-bootstrap";
import BFile from "../components/BFile";
import { AllDetailsInterface } from "../interfaces/allDetailsInterface";

export default function FilePage() {
    const {id} =  useParams();
    const [busFile, setBusFile] = React.useState<AllDetailsInterface | undefined | null>();

    const api = useApi()

    React.useEffect(() => {
        (async () => {
            const response = await api.get(`/files/${id}/all/details`);
            setBusFile(response.ok ? response.body : null);
        })()
    }, [id, api])


    let contents;
    if (busFile === undefined) {
        contents = (
            <Spinner animation="grow" variant="primary" />
          );
    }
    else if (busFile === null) {
        contents = <p>File not Found</p>
    }
    else {
        contents = <BFile fileData={busFile} />
    }

    return (
        <Main header>
            {contents}
        </Main>
    )
}