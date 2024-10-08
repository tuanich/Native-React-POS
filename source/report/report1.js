import React, { useRef, useCallback, useEffect, useState } from "react";
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { convertNumber } from "../api";

import { Svg } from 'react-native-svg';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import RenderItem from './renderItem';
import RenderChart from "./renderChart";
import * as Crypto from 'expo-crypto';
const colorScales = ['#4E8397', '#845EC2', '#2C73D2', '#FF6F91', '#008F7A', '#0081CF', '#4B4453', "#BEC1D2", '#42B0FF', '#C4FCEF', '#898C95', '#FFD573', '#95A9B8', '#008159', '#FF615F', '#8e44ad', '#FF0000', '#D0E9F4', '#AC5E00'];

export default function report1({ data, name }) {

    const [viewMode, setViewMode] = useState("chart");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sum, setSum] = useState();
    const [total, setTotal] = useState();
    const [dataP, setDataP] = useState([]);

    if (typeof data != 'undefined' && data != null) {
        useEffect(() => {

            var sum = 0;
            var total = 0;
            data.map(item => {
                sum += item.quantity;
                total += item.total;
            });
            setSum(convertNumber(sum));
            setTotal(convertNumber(total));
            setDataP(processData());

        }, [data]);

        function renderCategoryHeaderSection() {
            return (
                //    <View style={{ flexDirection: 'row', padding: SIZES.padding, justifyContent: 'space-between', alignItems: 'center' }}>
                //         {/* Title */}

                //         {/* Button */}
                <View style={{ alignItems: 'flex-end', padding: 8 }}>
                    <View style={{ flexDirection: 'row', }}>

                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: viewMode == "chart" ? COLORS.secondary : null,
                                height: 50,
                                width: 50,
                                borderRadius: 25
                            }}
                            onPress={() => setViewMode("chart")}
                        >
                            <Image
                                source={icons.chart}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: viewMode == "chart" ? COLORS.white : COLORS.darkgray,
                                }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: viewMode == "list" ? COLORS.secondary : null,
                                height: 50,
                                width: 50,
                                borderRadius: 25,
                                marginLeft: SIZES.base
                            }}
                            onPress={() => setViewMode("list")}
                        >
                            <Image
                                source={icons.menu}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: viewMode == "list" ? COLORS.white : COLORS.darkgray,
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                //   </View>
            )
        }
        const processData = useCallback(() => {

            if (JSON.stringify(data) != '[]') {
                const online = ["TakeAway", "Grab", "Baemin", "Goviet", "Now", "Loship"];
                let dataOffline = data.filter(item => !online.includes(item._id));

                let dataOnline = data.filter(item => online.includes(item._id));

                var sl = 0;
                var tt = 0;
                dataOffline.map(item => {
                    sl += Number(item.quantity);
                    tt += Number(item.total);
                })
                dataOffline = { '_id': 'Ăn tại quán', 'quantity': sl, 'total': tt };
                dataOnline.push(dataOffline);
                dataOnline.sort((a, b) => parseInt(b.total) - parseInt(a.total));

                setSelectCategoryByName(dataOnline[0]._id);

                let total = dataOnline.reduce((a, b) => a + (parseInt(b.total) || 0), 0)
                let count = dataOnline.reduce((a, b) => a + (parseInt(b.quantity) || 0), 0)
                let dataChart = dataOnline.map((item, index) => {
                    let percent = (item.total / total * 100).toFixed(0);
                    return {
                        label: `${percent}%`,
                        y: Number(item.total),
                        Count: item.quantity,
                        color: colorScales[index],
                        name: item._id,
                        id: index,
                        subTotal: item.total,
                    }
                })

                return dataChart;
            }
            else return []
        }, [data]);

        const setSelectCategoryByName = useCallback((name) => {

            let category = { name: name };
            setSelectedCategory(category);
        }, []);


        function renderChart() {

            let chartData = dataP;
            return (<RenderChart chartData={chartData} selectedCategory={selectedCategory} setSelectCategoryByName={setSelectCategoryByName} />)

        }



        function renderSummary() {
            let data = dataP;



            return (
                <View style={{ padding: SIZES.padding }} key={Crypto.randomUUID()}>


                    {<RenderItem data={data} setSelectCategoryByName={setSelectCategoryByName} selectedCategory={selectedCategory} name={name} />
                    }

                </View>

            )

        }


        function renderList() {
            return (
                <View style={styles.main}>
                    <View style={styles.orderContent}>
                        <View style={[styles.viewOrder, { flex: 0.12 }]}><Text style={styles.menuOrder}>STT</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Phương tiện</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.18 }]}><Text style={styles.menuOrder}>SL đơn</Text></View>
                        <View style={[styles.viewOrder, { flex: 0.35 }]} ><Text style={styles.menuOrder}>Thành tiền</Text></View>
                    </View>
                    <ScrollView>
                        <View>
                            {data ? data.map((e, index) =>
                            (<View style={styles.order} key={index}>
                                { }
                                <View style={{ flex: 0.11, alignItems: 'center', padding: 5 }}>
                                    <Text>{index + 1}</Text>
                                </View>
                                <View style={{ flex: 0.38, alignItems: 'flex-start', padding: 5 }}>
                                    <Text>{e._id}</Text>
                                </View>
                                <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                    <Text>{e.quantity}</Text>
                                </View>
                                <View style={{ flex: 0.37, alignItems: 'flex-end', padding: 4 }}>
                                    <Text>{convertNumber(e.total)}</Text>
                                </View>
                            </View>))
                                : null}

                        </View>

                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: 0.5, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>Tổng cộng</Text>
                            </View>
                            <View style={{ flex: 0.15, alignItems: 'center', padding: 5 }}>
                                <Text style={styles.sum}>{sum}</Text>
                            </View>
                            <View style={{ flex: 0.36, alignItems: 'flex-end', padding: 5 }}>
                                <Text style={styles.sum}>{total}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>)
        }

        return (
            <View style={{ flex: 1, backgroundColor: COLORS.lightGray2 }}>
                {/* Nav bar section */}


                {/* Header section */}


                {/* Category Header Section */}
                {renderCategoryHeaderSection()}

                <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                    {
                        viewMode == "list" &&
                        <View>
                            {renderList()}
                            {/* {renderIncomingExpenses()} */}
                        </View>

                    }
                    {

                        viewMode == "chart" &&
                        <View>
                            {
                                (typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? ([

                                    dataP[0].Count != 0 ? renderChart() : null
                                ]) : null
                            }
                            {

                                (typeof dataP != 'undefined' && typeof dataP[0] != 'undefined') ? ([

                                    dataP[0].Count != 0 ? renderSummary() : null
                                ]) : null
                            }
                        </View>

                    }
                </ScrollView>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },

    main: {
        flex: 1,
    },

    order: {
        flex: 1,
        flexDirection: 'row',
    },

    viewOrder: {
        backgroundColor: '#5E8D48',
        borderWidth: 0.2,
        borderColor: 'white',
        alignItems: 'center',

        // fontSize: 18,
        // color:'white',
    },
    orderContent: {
        flexDirection: 'row',
        //   flexWrap:'wrap',
        //  flex:1,
        //  justifyContent:'center',
    },
    menuOrder: {

        fontSize: 18,
        color: 'white',
        padding: 5,

    },
    sum: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})


