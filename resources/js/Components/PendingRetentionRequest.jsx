import { useState } from "react";

// TODO: test
// FIXME: darker color when clicked?

const PendingRetentionRequest = (props) => {
    const [isHovered, setHovered] = useState(false);

    return (
        <a href={"retention-requests/" + props.retentionRequest.id + "/edit"} className="text-decoration-none text-black">
            <div
                className="border p-2 mt-2 mb-2"
                style={{backgroundColor: isHovered ? "#87CEEB" : ""}}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div>{props.retentionRequest.requestorName} - {props.retentionRequest.departmentName}</div>
                <div>{props.retentionRequest.createdAt}</div>
            </div>
        </a>
    );
}

export default PendingRetentionRequest;
