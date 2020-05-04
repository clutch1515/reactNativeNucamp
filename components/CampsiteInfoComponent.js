import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Form, LocalForm } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};

const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId))
};

function RenderCampsite({props}) {   

    const { campsite } = props;
    
    if (campsite) {
        return (
            <Card
                featuredTitle={campsite.name}
                image={{uri: baseUrl + campsite.image}}>
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
                <View className="cardRow">
                <Icon
                    name={props.favorite ? 'heart' : 'heart-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.favorite ? 
                        console.log('Already set as a favorite') : props.markFavorite()}
                />
                <Icon
                    className="cardsItem"
                    name={props.favorite ? 'pencil' : 'pencil-o'}
                    type='font-awesome'
                    color='#f50'
                    raised
                    reverse
                    onPress={() => props.onShowModal()}    
                />
                </View>
            </Card>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating 
                    type='star'
                    fractions={0}
                    startingValue={item.rating}
                    imageSize={10}
                    readonly
                    style={{alignItems: 'flex-start', paddingVertical: '5%'}}
                />
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Card title='Comments'>
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}

class CampsiteInfo extends Component {
    constructor(props){
        super(props)
        this.state = {
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        };
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
 
    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    handleComment(campsiteId) {
        /* post comment */
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        });
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite 
                    campsite={campsite}
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        onRequestClose={() => this.toggleModal()}>
                        <View style={styles.modal}>
                            <Rating 
                                /*  showRating
                                 startingValue
                                 imageSize
                                 onFinishRating
                                 style */
                            />
                            <Input />
                            <View style={{margin: 10}} >
                                <Button
                                    onPress={() => {
                                        this.handleComment(campsiteId);
                                    }}
                                    color='#808080'
                                    title='Submit'
                                />
                            </View>
                            <View style={{margin: 10}} >
                                <Button
                                    onPress={() => {
                                        this.toggleModal();
                                    }}
                                    color='#808080'
                                    title='Cancel'
                                />
                            </View>
                        </View>
                    </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10,
    },
    modal: { 
        justifyContent: 'center',
        margin: 20,
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);