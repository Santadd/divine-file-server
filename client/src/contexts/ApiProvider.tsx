import React from "react";
import FileServerApiClient from "../FileServerApiClient";

interface ApiContextProps {
    children: React.ReactNode
}

const ApiContext = React.createContext<FileServerApiClient>({} as FileServerApiClient);

export default function ApiProvider(props: ApiContextProps) {
    const api = new FileServerApiClient();

    return (
        <ApiContext.Provider value={api}>
            {props.children}
        </ApiContext.Provider>
    )
}

export function useApi() {
    return React.useContext(ApiContext)
}
