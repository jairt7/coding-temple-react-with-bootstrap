import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const CharacterDetails = () => {
    const { id } = useParams()
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const marvelURL = `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=53f4d0fbe6779588ea6e0edeed364129&hash=dd5ba29bd5eb09ea1d85be635bec4b62`
    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const response = await axios.get(marvelURL);
                console.log(response.data.data.results[0])
                setCharacter(response.data.data.results[0]);
            } catch (error) {
                console.error('Error fetching characters:', error)
            }
            setLoading(false)
        }
        if (id) {
            fetchCharacter()
        }
        
    }, [id]);
    if (!loading && !character) {
        return (
            <NotFound />
        )
    }
    return (
        <div className='characterDetails'>
            {character && (
            <><img src={`${character.thumbnail.path}.${character.thumbnail.extension}`} alt={character.name} /><ul>
                    {character.comics.items.map((comic, index) => (
                        <li key={index}>{comic.name}</li>
                    )
                    )}
                </ul></>    
            )}
            
        </div>
    )

}

export default CharacterDetails;