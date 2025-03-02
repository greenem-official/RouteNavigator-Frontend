import { Transform, Type } from "class-transformer";
import moment from "moment-timezone";
import type { Moment } from "moment-timezone";
import 'reflect-metadata';
import {Route} from "./Route.ts";

const transformToMoment = ({ value }: { value: string }): Moment => {
    return moment.utc(value);
};

export class Booking {
    id!: number;

    @Type(() => Route)
    route!: Route;

    @Transform(transformToMoment)
    bookedAt!: Moment;

    ticketAmount!: number;
}