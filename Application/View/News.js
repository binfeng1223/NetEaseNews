'use strict';

var TopNewsCell = require('./TopNewsCell')
var NewsCell = require('./NewsCell')
var PhotoSetCell = require('./PhotoSetCell')

var React = require('react-native');

var {
	Image,
	ListView,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
} = React;

// http://c.m.163.com/nc/article/headline/T1348647853363/0-30.html

var BASE_URL = 'http://c.m.163.com';

var NEWS_URLS = [
	{
		'title': '头条',
		'urlString': 'headline/T1348647853363',
		'replyUrl': '3g_bbs',
	},
	{
		'title': 'NBA',
		'urlString': 'list/T1348649145984',
		'replyUrl': 'sports_nba_bbs',
	},
	{
		'title': '手机',
		'urlString': 'list/T1348649654285',
		'replyUrl': 'mobile_bbs',
	},
	{
		'title': '移动互联',
		'urlString': 'list/T1351233117091',
		'replyUrl': 'mobile_bbs',
	},
	{
		'title': '娱乐',
		'urlString': 'list/T1348648517839',
		'replyUrl': 'auto_bbs',
	},
	{
		'title': '时尚',
		'urlString': 'list/T1348650593803',
		'replyUrl': 'lady_bbs',
	},
	{
		'title': '电影',
		'urlString': 'list/T1348648650048',
		'replyUrl': 'ent2_bbs',
	},
	{
		'title': '科技',
		'urlString': 'list/T1348649580692',
		'replyUrl': 'tech_bbs',
	},
];

var News = React.createClass({

	getInitialState: function() {
		return {
			dataSource : new ListView.DataSource({
				rowHasChanged : (row1, row2) => row1 !== row2
			}),
		};
	},

	componentDidMount: function() {
		this.fetchData();
	},

	getUrl: function() {
		return BASE_URL + '/nc/article/' + NEWS_URLS[0].urlString + '/0-20.html';
	},

	fetchData: function() {
		fetch(this.getUrl())
			.then((response) => response.json())
			.then((responseData) => {

				for (var key in responseData) {
					responseData = responseData[key];
					break;
				};

				var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
				this.setState({
					dataSource : this.state.dataSource.cloneWithRows(responseData),
				});
				
			})
			.done();
	},

	render: function() {
		if (this.state.dataSource.getRowCount() === 0) {
			return (
				<View style={this.props.style}>
					<Text style={this.props.textStyle}>{this.props.title}</Text>
				</View>
			);
		}

		return (
			<ListView
				dataSource={this.state.dataSource}
				renderRow={this.renderRow}
				renderSeparator={this.renderSeparator}
				style={styles.listView} />
		);

	},

	renderSeparator: function(sectionID, rowID) {
		return (
			<View key={'SEP_' + sectionID + '_' + rowID} style={styles.rowSeparator}/>
		);
	},

	renderRow: function(news, sectionID, rowID) {
		if (rowID === '0') {
			return (<TopNewsCell model={news} />);
		} else if (news.skipType === 'photoset') {
			return (<PhotoSetCell model={news} />);
		} else {
			return (<NewsCell model={news} />);
		}
	},

});

var styles = StyleSheet.create({
	listView: {
		backgroundColor: '#f0f0f0',
	},
	rowSeparator: {
		backgroundColor: '#dbdbdb',
		height: 1,
	},
});

module.exports = News;