import axios from "axios";
import base_url from "../api/constants";

export const getAllCategories = () => {
	axios.get(`${base_url}/categories`).then(
		(response) => {
			console.log("categories");
			console.log(response);
			return response.data;
		},
		(error) => {
			console.log(error);
		}
	)
}