import {diferenceBetweenTimestamps, prepareForDisplay} from "./time";

it("expect correct output", () => {
    let result = diferenceBetweenTimestamps("2020-01-01", "2020-01-02");
    expect(result).toBe(86400000);

    result = diferenceBetweenTimestamps("2019-03-01", "2020-01-02");
    expect(result).toBe(26524800000);

    result = diferenceBetweenTimestamps("2020-03-01", "2020-01-02");
    expect(result).toBe(-5097600000);
});

it("expect nice output formatting",() => {
    const result = prepareForDisplay(86400000 / 1000);
    expect(result).toBe("1d");

    const result2 = prepareForDisplay(26524800000 / 1000);
    expect(result2).toBe("10m");
});