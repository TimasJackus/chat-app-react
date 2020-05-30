import { gql } from "@apollo/client";

export const EDIT_PROFILE = gql`
    mutation editProfile($data: EditProfileInput!, $image: Upload) {
        editProfile(data: $data, image: $image) {
            id
            email
            displayName
            phoneNumber
            description
            imageUrl
        }
    }
`;
