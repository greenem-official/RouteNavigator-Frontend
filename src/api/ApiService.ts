import {Location} from "../interfaces/Location.ts";
import axios from "axios";
import moment, {duration, type Moment} from "moment-timezone";
import type {Route} from "../interfaces/Route.ts";
import type {AuthData, ErrorMessage} from "../interfaces/AuthTypes.ts";
import {useAuthStore} from "../stores/AuthStore.ts";
import type {Booking} from "../interfaces/Booking.ts";
import {Config} from "./Config.ts";

export class ApiService {
    private static readonly API_URL = `${Config.BACKEND_URL}/api/main`;

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

            return response.data;
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

            return response.data;
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

            return response.data;
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        }
    }

    public static async checkToken(token: string): Promise<AuthData | ErrorMessage> {
        try {
            const response = await axios({
                method: 'post',
                url: `${this.API_URL}/checkToken`,
                headers: {},
                data: {
                    token: token,
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    }

    public static async getRoutes(searchParams: any, departureTimeMin: any, thisDateOnly: boolean): Promise<Route[]> {
        try {
            const transportAllowed = Object.entries(searchParams.value.transportType)
                .filter(([_, value]) => value === true)
                .map(([key]) => String(key).toString());

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
                    "fetchDays": thisDateOnly ? 1 : -1,
                    "transportAllowed": transportAllowed
                }
            });

            const data = response.data;
            for (const route of data) {
                route["departureTime"] = moment(route["departureTime"])
                route["arrivalTime"] = moment(route["arrivalTime"])
                route["duration"] = duration(route["duration"])
            }

            return data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            throw error;
        }
    }

    public static async getAvailableRouteDays(searchParams: any, departureTimeMin: any, daysAmount: number): Promise<Moment[]> {
        try {
            const transportAllowed = Object.entries(searchParams.value.transportType)
                .filter(([_, value]) => value === true)
                .map(([key]) => String(key).toString());

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
                    "fetchDays": daysAmount,
                    "fetchAvailability" : true,
                    "transportAllowed": transportAllowed
                }
            });

            const data = response.data;

            const newFormat: Moment[] = []
            data.forEach((item: string) => {
                newFormat.push(moment(Date.parse(item))); //.format('DD-MM'))
            });

            return newFormat;
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

            return response.data;
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

            return response.status;
        } catch (error) {
            console.error('Error on modifying a route:', error);
            throw error;
        }
    }

    public static async getBookings(): Promise<Booking[]> {
        try {
            const response = await axios({
                method: 'get',
                url: `${this.API_URL}/getBookings`,
                headers: {
                    "Authorization": `${ApiService.getAuthStore().authData?.token}`,
                },
            });

            const data = response.data;
            for (const route of data) {
                route["bookedAt"] = moment(route["bookedAt"])
            }

            return data;
        } catch (error) {
            console.error('Error booking a route:', error);
            throw error;
        }
    }
}
