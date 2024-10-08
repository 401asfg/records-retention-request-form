import { useState, useEffect } from "react";
import axios from 'axios';

// TODO: test
// TODO: add clear button?
// TODO: take burden off server by querying all once on creation, then filtering results on client side for each query?

const SearchableDropdown = (props) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.length === 0) return;
        setIsLoading(true);

        // FIXME: handle failure case
        axios.get(props.sourceRoute + "?query=" + query)
            .then((res) => { setResults(res.data.data); })
            .finally(() => { setIsLoading(false); });
    }, [query]);

    const selectResult = (index) => {
        // FIXME: check for index out of bounds?
        const result = results[index];
        const id = result.id;
        const name = result.name;

        props.setSelectedOptionId(id);
        setQuery(name);
    }

    const setDropdownToOpenOnValidQuery = (query) => {
        setIsDropdownOpen(query.length !== 0);
    }

    const endSearch = () => {
        setIsDropdownOpen(false);
        if (props.selectedOptionId === null) setQuery("");
    }

    const search = async (query) => {
        props.setSelectedOptionId(null);
        setDropdownToOpenOnValidQuery(query);
        setQuery(query);
    }

    const LoadingDropdownContent = () => {
        return <li className="p-2">Loading...</li>
    }

    const NoResultsDropdownContent = () => {
        return <li className="p-2">No results found</li>
    }

    const ResultsDropdownContent = () => {
        const Result = (props) => {
            const [isHovered, setIsHovered] = useState(false);

            return (
                <li
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onMouseDown={() => selectResult(props.index)}
                    className="p-2"
                    style={{backgroundColor: isHovered ? "#00BFFF" : ""}}
                >{props.result.name}</li>
            );
        }

        return results.map((result, i) => {
            return <Result key={result.id} result={result} index={i} />
        });
    }

    const DropdownContent = () => {
        if (isLoading) return <LoadingDropdownContent />
        if (results.length === 0) return <NoResultsDropdownContent />
        return <ResultsDropdownContent />
    }

    return (
        <div className="position-relative w-100">
            <input
                type="text"
                placeholder="Search..."
                className="w-100"
                value={query}
                onClick={(event) => setDropdownToOpenOnValidQuery(event.target.value)}
                onBlur={endSearch}
                onChange={(event) => search(event.target.value)}
                required
            />
            {isDropdownOpen && (
                <div className="w-100 border shadow bg-light position-absolute" style={{maxHeight: "200px", overflowY: "auto", zIndex: "1"}}>
                    <ul className="list-unstyled mb-0">
                        <DropdownContent />
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableDropdown;
