import { Location } from "./Location.ts";
import { TransportType } from "./TransportType.ts";
import { Transform, Type } from "class-transformer";
import moment from "moment-timezone";
import type { Moment, Duration } from "moment-timezone";
import 'reflect-metadata';

const transformToMoment = ({ value }: { value: string }): Moment => {
    return moment.utc(value);
};

const transformToDuration = ({ value }: { value: string }): Duration => {
    return moment.duration(value);
};

export class Route {
    id!: number;

    @Type(() => Location)
    departureLocation!: Location;

    @Type(() => Location)
    arrivalLocation!: Location;

    @Type(() => TransportType)
    transportType!: TransportType;

    price!: number;

    @Transform(transformToMoment)
    departureTime!: Moment;

    @Transform(transformToMoment)
    arrivalTime!: Moment;

    @Transform(transformToDuration)
    duration!: Duration;
}