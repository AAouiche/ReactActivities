import { Attendee } from "./attendee";

export interface Activity {
    id?: string;
    title?: string;
    date?: Date | null;
    description?: string;
    cancelled?: boolean;
    going?:boolean;
    category?: string;
    city?: string;
    venue?: string;
    hosting?:boolean;
    host?: Attendee;
    
    attendees?: Attendee[]; // This line includes an array of attendees
}