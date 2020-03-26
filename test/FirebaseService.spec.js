import firebase from 'firebase';
import * as FirebaseService from '../src/service/FirebaseService';
import md5 from 'md5';
import {Route} from '../src/data.module';

const mockDelete = jest.fn(() => Promise.resolve());

jest.mock('firebase', () => ({
    auth: jest.fn(() => ({
        currentUser: {
            uid: 'userUID',
        }
    })),
    storage: jest.fn(() => ({
        ref: jest.fn(() => ({
            put: jest.fn(() => ({
                on: jest.fn(),
            })),
            delete: mockDelete,
        })),
    })),
    database: jest.fn(() => ({
        ref: jest.fn(() => ({
            remove: jest.fn(() => Promise.resolve()),
        })),
    })),
}));

describe('FirebaseService', () => {
    afterEach(() => {
        fetch.resetMocks();
        jest.clearAllMocks();
    });

    describe('Photo', () => {
        xit('should save the photos to Firebase storage', async () => {
            fetch.mockResponse(JSON.stringify({name: 'hello'}));
            await FirebaseService.savePhoto('testUrl', 'testName', 'testRoute', () => {
            });
            expect(firebase.storage).toHaveBeenCalled();
        });

        it('should extract the image name out of the url', () => {
            const name = `${md5('itsAName')}.jpg`;
            const exampleUrl = `https://myhost.com/a/path/${name}?attribute=hello`;

            const extractedName = FirebaseService.extractNameOfPhoto(exampleUrl);
            expect(extractedName).toEqual(name);
        });

        it('should delete one photo', async () => {
            await FirebaseService.deletePhoto('aName', 'alsoAName');
            expect(mockDelete).toHaveBeenCalledTimes(1);
        });

        it('should delete all photos from route', async () => {
            const mockRoute = new Route('aName', null);
            const name = `${md5('itsAName')}.jpg`;
            mockRoute.photos = [
                {url: `https://myhost.com/a/path/${name}?attribute=hello`,},
                {url: `https://myhost.com/a/path/${name}?attribute=hello`,},
                {url: `https://myhost.com/a/path/${name}?attribute=hello`,},
            ];

            await FirebaseService.deleteRoute('aKEy', mockRoute);
            expect(mockDelete).toHaveBeenCalledTimes(3);
        });

        it('should delete photos, error', async () => {
            mockDelete.mockReturnValueOnce(Promise.reject({code: 'some reason'}));
            const mockRoute = new Route('aName', null);
            const name = `${md5('itsAName')}.jpg`;
            mockRoute.photos = [
                {url: `https://myhost.com/a/path/${name}?attribute=hello`,},
            ];

            await expect(FirebaseService.deleteRoute('aKEy', mockRoute)).rejects
                .toEqual({code: 'some reason'});
            expect(mockDelete).toHaveBeenCalledTimes(1);
        });
    });
});