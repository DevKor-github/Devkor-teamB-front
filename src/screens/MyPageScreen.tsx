import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabNavigatorParamList } from "../navigator/BottomTabNavigator";

type MyPageScreenProps = NativeStackScreenProps<BottomTabNavigatorParamList, "Mypage">;

const MyPageScreen = ({ navigation }: MyPageScreenProps) => {
    return (
        <View style={styles.container}>
             {/* <ImageBackground
            source={require('./assets/watermark.png')} // 워터마크 이미지 경로
            style={styles.container}
            imageStyle={styles.watermark} // 워터마크 이미지 스타일
        ></ImageBackground> */}
            <View style={styles.header}>
            <Image
                        source={require('@assets/images/UserImage.png')} // Replace with your avatar image URL
                        style={styles.avatar}
                    />
                <View style={styles.headerContent}>
                    
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>HIDDEN STORY</Text>
                        <View style={styles.userDetail}>
                        <Text style={styles.userSchool}>고려대학교 재학</Text>
                        <TouchableOpacity style={styles.schoolCertificationButton}>
                            <Text style={styles.schoolCertificationText}>학교 인증 완료</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.separator}/>

            <ScrollView style={styles.body}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>내 정보 수정</Text>
                    {["아이디 변경하기", "비밀번호 변경하기", "시간표 수정하기", "로그아웃", "탈퇴하기"].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.item}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>내 글 관리</Text>
                    {["내가 쓴 게시물", "내가 쓴 댓글", "내가 스크랩한 글"].map((item, index) => (
                        <TouchableOpacity key={index} style={styles.item}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        backgroundColor: "#ff1485",
        position: 'relative',
    },
    headerContent: {
        marginTop: 100, 
        flexDirection: "row",
        backgroundColor: 'white',
        width: 400,
        marginVertical: 0,
    },
    avatar: {
        marginTop: 15,
        width: 80,
        height: 80,
        borderRadius: 30,
        position: 'absolute',
        left: 16, 
        top: 40, 
        zIndex: 10, 
    },
    userInfo: {
        marginLeft: 16,
        zIndex: 10, 
        paddingBottom: 15,
    },
    userName: {
        marginTop: 45,
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        zIndex: 10, 
    },
    userSchool: {
        fontSize: 15,
        color: "black",
        marginVertical: 4,
        zIndex: 10, 
    },
    schoolCertificationButton: {
        backgroundColor: "#E8036E",
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        alignSelf: "center",
        marginLeft: 10,
        zIndex: 10, 
    },
    userDetail:{
        flexDirection: "row",
    },
    schoolCertificationText: {
        fontSize: 12,
        color: "#fff",
        alignContent: "center",
        marginBottom: 2,
        marginLeft: 3,
        marginRight: 3,
        fontWeight: 'bold',
    },
    separator:{
        alignSelf: 'center',
        height: 1,
        width: '90%', 
        backgroundColor: '#D9D9D9',
    },
    body: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: 'white',
    },
    section: {
        marginVertical: 5,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: '#000',
    },
    item: {
        paddingVertical: 13,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    itemText: {
        fontSize: 14,
        color: "#333",
    },
    watermark: {
        resizeMode: 'contain', 
        opacity: 0.1, 
    },
});

export default MyPageScreen;
