import { Button } from "react-bootstrap"
import { PaginationInfoInterface } from "../interfaces/paginationInfoInterface";

// Create a pagination button
interface MoreProps {
    paginationInfo: PaginationInfoInterface
    loadNextPage: any
}

export default function More(props: MoreProps) {

    let thereAreMore = false

    if (props.paginationInfo) {
        const  {hasNext} = props.paginationInfo;
        thereAreMore = hasNext
    }


    return (
        <div className="d-flex justify-content-end p-2">
            {
                thereAreMore && <Button  onClick={props.loadNextPage}>More &raquo;</Button>
            }
        </div>
    )
}