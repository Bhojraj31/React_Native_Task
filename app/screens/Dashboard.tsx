import { ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import { BarChart, PieChart } from 'react-native-gifted-charts';

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

interface Employee {
    id: number;
    employee_name: string;
    employee_salary: number;
    employee_age: number;
    profile_image: string;
}

type SalaryRange = '3-4' | '4-5' | '5-6';

interface SalaryRangeData {
    count: number;
    color: string;
}

const Dashboard = () => {
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedValue, setSelectedValue] = useState<string>('');
    // ------ State for isOpen ------
    const [isOpen, setIsOpen] = useState(false);
    const [barChartData, setBarChartData] = useState<{ result: { value: number }[]; ranges: number[][] } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://dummy.restapiexample.com/api/v1/employees');
                setEmployeeData(response.data.data);
                setBarChartData(getRangeSalary(response.data.data));
                setSelectedValue('Monthly')
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const deleteEmployee = (id: number) => {
        setEmployeeData(prevData => prevData.filter(employee => employee.id !== id));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // if (error) {
    //     return (
    //         <View style={styles.errorContainer}>
    //             <Text style={styles.errorText}>{error}</Text>
    //         </View>
    //     );
    // }

    //! PIE Charts for AGE
    const getColorForRange = (range: string) => {
        switch (range) {
            case '20-30':
                return '#661df0';
            case '30-40':
                return '#35d0a4';
            case '40-50':
                return '#fe935e';
            default:
                return 'black';
        }
    };

    const calculateAgeRanges = (employees: Employee[]) => {
        const ageRanges: { [key: string]: number } = {
            '20-30': 0,
            '30-40': 0,
            '40-50': 0
        };

        employees.forEach(employee => {
            if (employee.employee_age >= 20 && employee.employee_age < 30) {
                ageRanges['20-30']++;
            } else if (employee.employee_age >= 30 && employee.employee_age < 40) {
                ageRanges['30-40']++;
            } else if (employee.employee_age >= 40 && employee.employee_age < 50) {
                ageRanges['40-50']++;
            }
        });

        return Object.entries(ageRanges).map(([range, count]) => ({
            key: range,
            value: count,
            svg: { fill: getColorForRange(range) }
        }));
    };

    const pieDataAge = calculateAgeRanges(employeeData);

    //! PIE Charts for SALARY
    const processSalaries = (data: Employee[]) => {
        const ranges: Record<SalaryRange, SalaryRangeData> = {
            '3-4': { count: 0, color: '#ffe0ce' },
            '4-5': { count: 0, color: '#d7fddb' },
            '5-6': { count: 0, color: '#e5d8f5' }
        };

        data.forEach(employee => {
            const salaryInLPA = employee.employee_salary / 100000;
            if (salaryInLPA >= 3 && salaryInLPA < 4) {
                ranges['3-4'].count += 1;
            } else if (salaryInLPA >= 4 && salaryInLPA < 5) {
                ranges['4-5'].count += 1;
            } else if (salaryInLPA >= 5) {
                ranges['5-6'].count += 1;
            }
        });

        const totalCount = data.length;

        return Object.keys(ranges).map(key => {
            const rangeKey = key as SalaryRange;
            const percentage = ((ranges[rangeKey].count / totalCount) * 100).toFixed(2) + '%';
            return {
                name: `${rangeKey} LPA`,
                value: ranges[rangeKey].count,
                color: ranges[rangeKey].color,
                label: percentage
            };
        });
    };

    const pieDataSalary = processSalaries(employeeData);

    //! Render Items for flatList
    const renderItem = ({ item }: { item: Employee }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemHeaderText}>Employee ID: <Text style={styles.itemIdText}>{item.id}</Text></Text>
                <TouchableOpacity style={styles.trashButton} onPress={() => deleteEmployee(item.id)}>
                    <IconButton icon='trash-can-outline' size={20} iconColor='#123c6e' />
                </TouchableOpacity>
            </View>
            <View style={styles.itemContent}>
                <View style={[styles.itemRow, { borderBottomColor: '#818181', borderBottomWidth: 0.5, }]}>
                    <Text>Employee Name</Text>
                    <Text>{item.employee_name}</Text>
                </View>
                <View style={[styles.itemRow, { borderBottomColor: '#818181', borderBottomWidth: 0.5, }]}>
                    <Text>Employee Salary</Text>
                    <Text>{item.employee_salary}</Text>
                </View>
                <View style={styles.itemRow}>
                    <Text>Employee Age</Text>
                    <Text>{item.employee_age}</Text>
                </View>
            </View>
        </View>
    );

    // ! DropDown 
    // ------ Options data for dropdown ------
    const options = ['Monthly', 'Weekly', 'Yearly'];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        // setOnSelect(value);
        toggleDropdown();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>
                        Dashboard
                        {'\n'}
                        <Text style={styles.headerSubtitle}>Good Morning</Text>
                    </Text>
                    <View style={styles.accountIconContainer}>
                        <IconButton icon="account" size={40} iconColor='#fff' />
                    </View>
                </View>
                <View style={styles.accountSelector}>
                    <Text style={styles.accountSelectorText}>Select Account Number</Text>
                    <TextInput
                        placeholder='All'
                        style={styles.accountSelectorInput}
                    />
                    <IconButton icon='magnify' size={20} iconColor='#818181' style={styles.accountSelectorIcon} />
                </View>
            </View>
            <ScrollView>
                <View style={styles.chartContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#123c6e' }}>
                            AGE VS SALARY
                        </Text>
                        {/* Dropdown */}
                        <TouchableOpacity onPress={toggleDropdown} style={styles.headerDropDown}>
                            <Text style={{ color: '#000', fontSize: 14, }}>{selectedValue}</Text>
                            <Image
                                source={require('../images/Arrow.png')}
                                style={[styles.arrowIcon, { tintColor: '#000' }, isOpen && styles.rotateArrow]}
                            />
                        </TouchableOpacity>
                        {isOpen && (
                            <View style={styles.dropdown}>
                                <FlatList
                                    data={options}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleSelect(item)}>
                                            <Text style={{ color: '#000', fontSize: 14, }}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyExtractor={(item) => item}
                                />
                            </View>
                        )}
                    </View>
                    {barChartData ? (
                        <BarChart
                            frontColor={'#123c6e'}
                            barWidth={22}
                            data={barChartData.result}
                            yAxisLabelWidth={25}
                            animationDuration={5}
                            xAxisLabelTexts={['20-30', '30-40', '40-50', '50-60']}
                            height={200}
                            width={300}
                            xAxisLength={300}
                            disableScroll
                            spacing={50}
                            yAxisLabelTexts={categorizeSalaries(barChartData.ranges)}
                        />
                    ) : (
                        <Text>No data available for chart</Text>
                    )}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: 10 }}>
                        <Text style={{ fontSize: 15, color: '#818181' }}>
                            x-axis: <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Age</Text>(years)
                        </Text>
                        <Text style={{ fontSize: 15, color: '#818181' }}>
                            x-axis: <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Salary</Text>(LPA)
                        </Text>
                    </View>
                </View>
                <View style={styles.chartContainer}>
                    <Text style={styles.employeeDetailsTitle}>EMPLOYEE AGE</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 10 }}>
                        <View style={{ backgroundColor: '#661df0', padding: 10, borderRadius: 10, paddingHorizontal: 15 }}>
                            <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>20-30 YEARS</Text>
                        </View>
                        <View style={{ backgroundColor: '#35d0a4', padding: 10, borderRadius: 10, paddingHorizontal: 15 }}>
                            <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>30-40 YEARS</Text>
                        </View>
                        <View style={{ backgroundColor: '#fe935e', padding: 10, borderRadius: 10, paddingHorizontal: 15 }}>
                            <Text style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>40-50 YEARS</Text>
                        </View>
                    </View>
                    <View style={styles.pieChartContainer}>
                        <PieChart
                            data={pieDataAge}
                            innerRadius={95}
                            showText
                            donut
                            centerLabelComponent={() => (
                                <View style={styles.pieChartCenterLabel}>
                                    <Text style={styles.pieChartCenterLabelText}>20 - 30</Text>
                                    <Text style={styles.pieChartCenterLabelSubText}>YEARS</Text>
                                    <View style={styles.pieChartCenterLabelPercentageContainer}>
                                        <Text style={styles.pieChartCenterLabelPercentage}>70%</Text>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                </View>
                <View style={styles.chartContainer}>
                    <Text style={styles.employeeDetailsTitle}>EMPLOYEE SALARY</Text>
                    <View style={styles.pieChartContainer}>
                        <PieChart
                            data={pieDataSalary}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#661df0', backgroundColor: '#661df0', borderRadius: 50 }}></View>
                            <Text style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}>3-4LPA</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#35d0a4', backgroundColor: '#35d0a4', borderRadius: 50 }}></View>
                            <Text style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}>4-5LPALPA</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#fe935e', backgroundColor: '#fe935e', borderRadius: 50 }}></View>
                            <Text style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}>5-6LPA</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <View style={styles.employeeDetailsHeader}>
                        <Text style={styles.employeeDetailsTitle}>EMPLOYEE DETAILS</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <Text style={styles.viewAllButtonText}>View All {'>'}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={employeeData}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#123c6e',
        height: height / 4.2,
        borderBottomLeftRadius: 50,
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '400',
    },
    accountIconContainer: {
        width: 50,
        height: 50,
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountSelector: {
        marginTop: 15,
    },
    accountSelectorText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: 'bold',
        marginVertical: 5,
    },
    accountSelectorInput: {
        height: 40,
        width: '100%',
        color: '#818181',
        backgroundColor: '#fff',
        borderRadius: 3,
        padding: 10,
        position: 'relative',
        marginTop: 5,
    },
    accountSelectorIcon: {
        position: 'absolute',
        right: 0,
        top: 40,
    },
    chartContainer: {
        width: '96%',
        height: height / 2.3,
        backgroundColor: '#ffffff',
        margin: 8,
        marginVertical: 15,
        borderRadius: 15,
        borderColor: '#818181',
        borderWidth: 0.6,
    },
    itemContainer: {
        width: '96%',
        backgroundColor: '#ffffff',
        margin: 8,
        marginVertical: 15,
        borderRadius: 15,
        borderColor: '#818181',
        borderWidth: 0.6,
    },
    itemHeader: {
        flexDirection: 'row',
        backgroundColor: '#e8f2fe',
        justifyContent: 'space-between',
        padding: 10,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    itemHeaderText: {
        fontSize: 14,
        color: '#123c6e',
    },
    itemIdText: {
        fontSize: 14,
        color: '#d63c31',
    },
    trashButton: {
        backgroundColor: '#f7cfd0',
        padding: 2,
        borderRadius: 5,
    },
    itemContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    employeeDetailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    employeeDetailsTitle: {
        fontSize: 18,
        color: '#123c6e',
        paddingHorizontal: 10,
        paddingTop: 10,
        fontWeight: '600',
    },
    viewAllButton: {
        backgroundColor: '#FBCEB1',
        padding: 2,
        borderRadius: 5,
    },
    viewAllButtonText: {
        color: '#FF5733',
    },
    pieChartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    pieChartCenterLabel: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieChartCenterLabelText: {
        fontSize: 30,
        color: '#123c6e',
        fontWeight: 'bold',
    },
    pieChartCenterLabelSubText: {
        fontSize: 15,
        color: '#123c6e',
        fontWeight: 'bold',
    },
    pieChartCenterLabelPercentageContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 5,
        marginTop: 10,
    },
    pieChartCenterLabelPercentage: {
        fontSize: 12,
        color: '#123c6e',
        fontWeight: 'bold',
    },
    headerDropDown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgray',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    arrowIcon: {
        marginLeft: 'auto',
        width: 18,
        height: 18,
        transform: [{ rotate: '270deg' }],
    },
    rotateArrow: {
        transform: [{ rotate: '90deg' }],
    },
    dropdown: {
        position: 'absolute',
        top: 30,
        right: 35,
    },
});

const getRangeSalary = (data: Employee[]): { result: { value: number }[]; ranges: number[][] } => {
    if (data.length > 0) {
        const obj: { [key: string]: number[] } = {};

        data.forEach(item => {
            if (item.employee_age >= 0 && item.employee_age < 30) {
                obj[0] ? obj[0].push(item.employee_salary) : (obj[0] = [item.employee_salary]);
            } else if (item.employee_age >= 30 && item.employee_age < 40) {
                obj[1] ? obj[1].push(item.employee_salary) : (obj[1] = [item.employee_salary]);
            } else if (item.employee_age >= 40 && item.employee_age < 50) {
                obj[2] ? obj[2].push(item.employee_salary) : (obj[2] = [item.employee_salary]);
            } else if (item.employee_age >= 50) {
                obj[3] ? obj[3].push(item.employee_salary) : (obj[3] = [item.employee_salary]);
            }
        });

        const result = Object.values(obj).map(salaries => {
            const sum = salaries.reduce((acc, salary) => acc + salary, 0);
            return { value: Math.round(sum / salaries.length) };
        });

        return { result, ranges: Object.values(obj) };
    }
    return { result: [], ranges: [] };
};

const categorizeSalaries = (salaryArrays: number[][]) => {
    if (!salaryArrays || salaryArrays.length === 0) return [];

    const intervalSize = 50000;
    let categorizedSalaries: { [key: string]: number[] } = {};

    let salaries = salaryArrays.flat();

    salaries.forEach(salary => {
        let intervalStart = Math.floor(salary / intervalSize) * intervalSize;
        let intervalEnd = intervalStart + intervalSize;
        let label = `${intervalStart / 100000}-${intervalEnd / 100000} lac`;

        if (!categorizedSalaries[label]) {
            categorizedSalaries[label] = [];
        }
        categorizedSalaries[label].push(salary / 100000);
    });

    let keys = Object.keys(categorizedSalaries);
    keys.sort((a, b) => parseFloat(a.split('-')[0]) - parseFloat(b.split('-')[0]));

    return keys;
};
