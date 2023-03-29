import axios from "axios";
import base_url from "../api/constants";

export const getAllCategories = () => {
	axios.get(`${base_url}/categories`).then(
		(response) => {
			return response.data;
		},
		(error) => {
		}
	)
}