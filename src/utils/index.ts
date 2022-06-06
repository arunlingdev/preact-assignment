import { Holiday } from "../types/booking";

const filterBy = (data: Holiday[], { type, value }: { type: string; value: string[]; }) => {
	if (!value.length) return data;
	const filtered = data.filter((item) => {
		if (type === "starRating") {
			return value.includes(item.hotel.content.starRating);
		};
		if (type === "pricePerPerson") {
			const minMaxes = value.map(v => v.split("-"));
			return minMaxes.find(([min, max]) => item.pricePerPerson > Number(min) && item.pricePerPerson < Number(max))
		};
		if (type === "hotelFacilities") {
			const availableFacilities = item.hotel.content.hotelFacilities.filter((facility) => value.includes(facility));
			return availableFacilities.length === value.length
		};
		return item;
	});
	return filtered;
};

export { filterBy };