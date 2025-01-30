import { useParams } from "react-router-dom";
import CharacterDetails from "./CharacterDetail";

function CharacterDetailWrapper() {
    let params = useParams()

    return <CharacterDetails params={params} />
}

export default CharacterDetailWrapper;