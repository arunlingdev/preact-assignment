import { h, JSX } from "preact"
import { useRouter } from "preact-router";
import { useEffect, useState } from "preact/hooks";
import SearchComponent from "../components/search.component";
import { doRequest } from "../services/http.service";
import { BookingRequest, BookingResponse, Holiday } from "../types/booking";
import { DateTime } from "luxon";
import SearchResult from "../components/searchResult.component";
import { LoaderComponent } from "../components/loader.component";

export default function ResultsRoute(): JSX.Element {
    const [searchParams] = useRouter();
    const [holidays, setHolidays] = useState<Holiday[][]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const departureDate = DateTime.fromFormat(searchParams?.matches?.departureDate, "yyyy-MM-dd").toFormat("dd-MM-yyyy");
        const requestBody: BookingRequest = {
            "bookingType": "holiday",
            "location": searchParams?.matches?.location,
            "departureDate": departureDate,
            "duration": searchParams?.matches?.duration as unknown as number,
            "gateway": "LHR",
            "partyCompositions": [
                {
                    "adults": searchParams?.matches?.adults as unknown as number,
                    "childAges": [],
                    "infants": 0
                }
            ]
        }

        doRequest("POST", "/cjs-search-api/search", requestBody)
            .then((response: unknown | BookingResponse) => {
                setLoading(false);
                return setHolidays([response?.holidays]);
            }).catch((err) => {
                setLoading(false);
                setError(err?.response?.data?.errors[0]);
            })
    }, [searchParams])

    return (
        <section>
            {loading ? (
				<LoaderComponent />
			) : (
				<div>
                    <SearchComponent />
					{holidays.length >= 1
						? (
							<SearchResult holidays={holidays[0]} />
						)
						:
						<h4>{error && <label>{error}</label>}</h4>
					}
				</div>
			)}
        </section>
    )
}