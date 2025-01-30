import axios from 'axios';
import { useState, useEffect } from 'react';
import CharacterDetails from './CharacterDetail';
import { useNavigate } from 'react-router-dom';

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [characterId, setCharacterId] = useState();
    const marvelURL = 'https://gateway.marvel.com/v1/public/characters?ts=1&apikey=53f4d0fbe6779588ea6e0edeed364129&hash=dd5ba29bd5eb09ea1d85be635bec4b62'
    const navigate = useNavigate()
    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const response = await axios.get(marvelURL);
                setCharacters(response.data.data.results);
                console.log(response.data.data.results)
            } catch (error) {
                console.error('Error fetching characters:', error)
            }
        }
        fetchCharacters()
        
    }, []);
    return (
        <div className='characters'>
            <h1>Characters:</h1>
            <ul className='characterList'>
                {characters.map((character, index) => (
                    <li key={index}>
                        <button onClick={() => navigate(`/character-details/${character.id}`)}>
                            <h5>{character.name}</h5>
                            <p>ID: {character.id}</p>
                        </button>
                    </li>
                    ))}
            </ul>
        </div>
    )
}

export default CharacterList;

// 