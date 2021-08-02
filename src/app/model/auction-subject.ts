import { Category } from "./category";

export class AuctionSubject {
    code: string;
    caption: string;
    description: string;
    basicPrice: number;
    soldPrice: number;
    categories: Category[] = [];
    publishDate: Date;
    private endDate: Date;
    picByte?: any;
    bid?: number;
    archive: boolean;

    set endDateAccessor(val: Date) {
        if (val == null) {
            this.endDate = null;
            return;
        }
        let date = new Date(val);
        date.setSeconds(0);
        console.log(date);
        this.endDate = date;
    }

    get endDateAccessor(): Date {
        return this.endDate;
    }

    equals(subject: AuctionSubject): boolean {
        return this.code === subject.code
            && this.caption === subject.caption
            && this.basicPrice === subject.basicPrice
            && this.endDate === subject.endDate
            && this.compareDescription(subject.description)
            && this.compareCategories(subject.categories);
    }

    compareCategories(categories: Category[]) {
        if (categories.length !== this.categories.length) {
            return false;
        }
        categories.forEach(category => {
            if (!this.categories.includes(category)) {
                return false;
            }
        });
        return true;
    }

    compareDescription(description: string): boolean {
        if (description && this.description) {
            return description === this.description;
        } else if (!this.description) {
            return description === '' || description == null;
        } else if (!description) {
            return this.description === '' || this.description == null;
        }
    }
}