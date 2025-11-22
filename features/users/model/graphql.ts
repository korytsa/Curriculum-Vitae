import { gql } from "@apollo/client";

export const USERS_QUERY = gql`
	query Users {
		users {
			id
			email
			department_name
			position_name
			profile {
				id
				first_name
				last_name
				avatar
            }
        }
    }
`;