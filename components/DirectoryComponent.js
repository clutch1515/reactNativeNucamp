import React from 'react';
import Loading from './LoadingComponent';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

const mapStateToProps = state => {
    return {
        campsites: state.campsites
    };
};

function Directory(props) {

    const renderDirectoryItem = ({item}) => {
        return (
            <Tile
                title={item.name}
                caption={item.description}
                featured
                onPress={() => navigate('CampsiteInfo', { campsiteId: item.id })}
                imageSrc={{uri: baseUrl + item.image}}
            />
        );
    };

    if (this.props.campsites.isLoading) {
        return <Loading />;
    }
    if (this.props.campsites.errMess) {
        return (
            <View>
                <Text>{this.props.campsites.errMess}</Text>
           </View>
        );
    }
     
    return (
        <FlatList
            data={this.props.campsites.campsites}
            renderItem={renderDirectoryItem}
            keyExtractor={item => item.id.toString()}
        />
    );
}

export default connect(mapStateToProps)(Directory);