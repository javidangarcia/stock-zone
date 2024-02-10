import { useState } from "react";
import Follow from "./Follow";
import Like from "./Like";
import Dislike from "./Dislike";

export default function Interactions({ ticker }) {
    const [likers, setLikers] = useState([]);
    const [dislikers, setDislikers] = useState([]);

    return (
        <>
            <Follow ticker={ticker} />
            <Like
                ticker={ticker}
                likers={likers}
                setLikers={setLikers}
                dislikers={dislikers}
                setDislikers={setDislikers}
            />
            <Dislike
                ticker={ticker}
                dislikers={dislikers}
                setDislikers={setDislikers}
                likers={likers}
                setLikers={setLikers}
            />
        </>
    );
}
