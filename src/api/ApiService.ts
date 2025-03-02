import {Location} from "../interfaces/Location.ts";
import axios from "axios";
import moment, {duration} from "moment-timezone";
import type {Route} from "../interfaces/Route.ts";
import type {AuthData, ErrorMessage} from "../interfaces/AuthTypes.ts";
import {useAuthStore} from "../stores/AuthStore.ts";
import type {Booking} from "../interfaces/Booking.ts";
// import { plainToInstance } from "class-transformer";

export class ApiService {
    private static readonly API_URL = 'http://127.0.0.1:8080/api/main';

    private static getAuthStore() {
        return useAuthStore();
    }

    public static async getLocations(text: string): Promise<Location[]> {
        try {
            const response = await axios({
                method: 'get',
                url: `${this.API_URL}/getLocations?text=${encodeURIComponent(text)}`,
                headers: {},
            });

            const data = response.data;
            return data;
            // return plainToInstance(Location, data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            throw error;
        }
    }

    public static async login(email: string, password: string): Promise<AuthData | ErrorMessage> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/login`,
                headers: {},
                data: {
                    email: email,
                    password: password,
                }
            });

            const data = response.data;
            return data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    public static async register(email: string, username: string, password: string): Promise<AuthData> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/register`,
                headers: {},
                data: {
                    email: email,
                    username: username,
                    password: password,
                }
            });

            const data = response.data;
            return data;
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        }
    }

    public static async getRoutes(searchParams: any, departureTimeMin: any, thisDateOnly: boolean): Promise<Route[]> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/findRoutes`,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "departureLocation": searchParams.value.from,
                    "arrivalLocation": searchParams.value.to,
                    "departureTimeMin": departureTimeMin,
                    "thisDateOnly": thisDateOnly,
                    "transportAllowed": searchParams.value.transportType
                }
            });

            const data = response.data;
            for (const route of data) {
                route["departureTime"] = moment(route["departureTime"])
                route["arrivalTime"] = moment(route["arrivalTime"])
                route["duration"] = duration(route["duration"])
            }

            return data;
            // return plainToInstance(Location, data);
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

    public static async bookRoute(routeId: number, amount: number): Promise<any> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/bookRoute`,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${ApiService.getAuthStore().authData?.token}`,
                },
                data: {
                    "routeId": routeId,
                    "ticketsAmount": amount,
                }
            });

            const data = response.data;
            // for (const route of data) {}

            return data;
            // return plainToInstance(Location, data);
        } catch (error) {
            console.error('Error booking a route:', error);
            throw error;
        }
    }

    public static async modifyBooking(bookingId: number, setAmount: number): Promise<any> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/modifyBooking`,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${ApiService.getAuthStore().authData?.token}`,
                },
                data: {
                    "bookingId": bookingId,
                    "setTicketsAmount": setAmount,
                }
            });

            const data = response.data;
            // for (const route of data) {}

            return data;
            // return plainToInstance(Location, data);
        } catch (error) {
            console.error('Error on modifying a route:', error);
            throw error;
        }
    }

    public static async getBookings(): Promise<Booking[]> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/getBookings`,
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${ApiService.getAuthStore().authData?.token}`,
                },
            });

            const data = response.data;
            for (const route of data) {
                route["bookedAt"] = moment(route["bookedAt"])
            }

            return data;
            // return plainToInstance(Location, data);
        } catch (error) {
            console.error('Error booking a route:', error);
            throw error;
        }
    }
}
