import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { BookingResponse, Holiday } from "../types/booking";
import { ratings, pricePerPerson, facilities } from "../consts/searchResult";
import * as styles from "./searchResult.module.less";
import {filterBy } from "../utils";

const SearchResult = (props: BookingResponse) => {
	const holidayData = props.holidays;
	const [selectedStars, setSelectedStars] = useState<string[]>([]);
	const [selectedPricePerPerson, setSelectedPricePerPerson] = useState<string[]>([]);
	const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

	const [filteredHotelDetails, setFilteredHotelDetails] = useState<Holiday[]>([]);

	useEffect(() => {
		const filterByStar = filterBy(holidayData, { type: "starRating", value: selectedStars });
		const filterByStarPrice = filterBy(filterByStar, { type: "pricePerPerson", value: selectedPricePerPerson });
		const filterByStarPriceFacility = filterBy(filterByStarPrice, { type: "hotelFacilities", value: selectedFacilities });
		setFilteredHotelDetails([...filterByStarPriceFacility]);
	}, [selectedStars, selectedPricePerPerson, selectedFacilities, holidayData]);

	const handleChange = (event: { target: { name: string; checked: Boolean; id: string; }; }) => {
		if (event.target.name === 'starRating') {
			if (!event.target.checked) {
				setSelectedStars(selectedStars.filter((value => (value !== event.target.id))))
			} else {
				setSelectedStars([...selectedStars, (event.target.id)]);
			}
		}

		if (event.target.name === 'pricePerPerson') {
			if (!event.target.checked) {
				setSelectedPricePerPerson(selectedPricePerPerson.filter((value => (value !== event.target.id))))
			} else {
				setSelectedPricePerPerson([...selectedPricePerPerson, (event.target.id)]);
			}
		}

		if (event.target.name === 'hotelFacilities') {
			if (!event.target.checked) {
				setSelectedFacilities(selectedFacilities.filter((value => (value !== event.target.id))))
			} else {
				setSelectedFacilities([...selectedFacilities, (event.target.id)]);
			}
		}
	}

	return (
		<div className={styles["searchResults"]}>{filteredHotelDetails.length > 0 && <label className={styles["totalCount"]}> Total Holidays Found : {filteredHotelDetails.length}</label>}
			<div className={styles["grid"]}>
				<div className={styles["col"]}>
					<div className={styles["filter-container"]}>
						<label id="filter_label" className={styles["label-heading"]}>Filter by:</label>
						<div className={styles["filter-label-margin"]}>
							<label id="star_rating_label" className={styles["label-subheading"]}>Star rating</label>
							{ratings.map((option) => (
								<label className={styles["checkbox-container"]} key={`star${option.value}`}>{option.label}
									<input
										type="checkbox"
										id={option.value}
										name="starRating"
										checked={selectedStars.includes(option.value)}
										onChange={handleChange}
									/>
									<span className={styles["checkmark"]}></span>
								</label>
							))}
						</div>
						<div className={styles["filter-label-margin"]}>
							<label id="person_price_label" className={styles["label-subheading"]}>Price per person</label>
							{pricePerPerson.map((option) => (
								<label className={styles["checkbox-container"]} key={`price${option.value}`}>{option.label}
									<input
										type="checkbox"
										id={`${option.min}-${option.max}`}
										name='pricePerPerson'
										checked={selectedPricePerPerson.includes(`${option.min}-${option.max}`)}
										onChange={handleChange}
									/>
									<span className={styles["checkmark"]}></span>
								</label>
							))}
						</div>
						<div className={styles["filter-label-margin"]}>
							<label id="hotel_facilities_label" className={styles["label-subheading"]}>Hotel facilities</label>
							{facilities.map((option) => (
								<label className={styles["checkbox-container"]} key={`facility${option.value}`}>{option.label}
									<input
										type="checkbox"
										id={option.label}
										name='hotelFacilities'
										checked={selectedFacilities.includes(option.label)}
										onChange={handleChange}
									/>
									<span className={styles["checkmark"]}></span>
								</label>
							))}
						</div>
					</div>
				</div>
				<div className={styles["col"]}>
					{filteredHotelDetails.length > 0 ?
						(<div className={styles["results"]}> {filteredHotelDetails.map((hotelData: Holiday, id: number) => (<div className={styles["card-container"]}>
							<img id={`hotel_image_${id}`} src={hotelData?.hotel?.content?.images[0]?.RESULTS_CAROUSEL?.url}
								alt="card preview" />
							<div className={styles["card-body"]}>
								<h1>{hotelData?.hotel?.name}</h1>
								<p className={styles["price"]}>£{hotelData?.pricePerPerson}*</p>
								<label id="rating_label" className={styles["ratings-text"]}>Rating</label>
								<p>{hotelData?.hotel?.content?.starRating ?
									hotelData?.hotel.content.starRating : 0}</p>
								<p>{hotelData?.hotel?.content?.hotelDescription.slice(0, 350) + "..."}</p>
								<p></p>
							</div>
						</div>
						))}
						</div>) : (
							<label id="no_result_found" className={styles["notFound"]}>Not finding what you’re looking for? Try searching another term.</label>
						)}
				</div>
			</div>
		</div>
	)
}

export default SearchResult;