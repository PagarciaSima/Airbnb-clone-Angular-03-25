import { CategoryName } from "../../layout/navbar/category/category.model";
import { BathsVO, BedroomsVO, BedsVO, DescriptionVO, GuestVO, priceVO, TitleVO } from "./listing-vo.model";
import { NewListingPicture } from "./picture.model";

export interface NewListingInfo {
    guests: GuestVO,
    bedrooms: BedroomsVO,
    beds: BedsVO,
    baths: BathsVO
}

export interface NewListing {
    category: CategoryName,
    location: string,
    infos: NewListingInfo,
    picture: Array<NewListingPicture>,
    description: Description,
    price: priceVO
}

export interface Description {
    title: TitleVO,
    description: DescriptionVO
}

export interface CreatedListing {
    publicId: string
}