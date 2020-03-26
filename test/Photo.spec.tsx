import {shallow} from 'enzyme';
import Photo from "../src/screen/Photo";
import {IPhoto} from "../src/data.module";
import {StackNavigationProp} from "@react-navigation/stack";
import React from "react";
import ActivityRunner from "../src/component/ActivityRunner";

const mockNavigation: StackNavigationProp<any> = {
    getParam: (any: string) => {
        const photo: IPhoto = {
            url: 'photoUrl.com',
            coordinate: {
                longitude: 1,
                latitude: 1,
            }
        };
        return photo
    }
};

describe('Photo', () => {
    let component;

    beforeEach(() => {
        component = shallow(<Photo navigation={mockNavigation}/>);
        component.setState({width: 100, height: 100});
    });

    it('should match snapshot', () => {
        expect(component.not.contains(<ActivityRunner text={'Waiting for image'}/>));
        expect(component).toMatchSnapshot();
    });


    it('should match snapshot when state isn\'t updated so far', () => {
        const component = shallow(<Photo navigation={mockNavigation}/>);
        expect(component.contains(<ActivityRunner text={'Waiting for image'}/>));
       
        expect(component).toMatchSnapshot();
    });

    xit('should calculate the height by the width',() => {
        // how can i mock Dimensions
        jest.mock('Dimensions', () => {
            // const Dim = Dimensions as jest.Mocked<typeof Dimensions>;
            // Dim.get = jest.fn(() => ({width: 100, height: 100}));
            // return Dimensions;
        });
    });

    xit('should delete photo', () => {
        const mockDeletePhoto = jest.fn(() => Promise.resolve());
        jest.mock('../src/service/FirebaseService', () => ({
            deletePhoto: mockDeletePhoto,
        }));

        //how can i access the onPress function on the TouchableOpacity in the navigationOption?
        console.log(component.find('TouchableOpacity'));
        expect(mockDeletePhoto).toHaveBeenCalled();
        mockDeletePhoto.mockClear();
    });
});