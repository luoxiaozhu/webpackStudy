// 将数据根据指定列的值分割成多份
export function dataDivide(colName, names, res) {
    let seq;
    res.columns.forEach(function(col, idx) {
        if (col.name === colName) {
            seq = idx;
        }
    });

    let retArr = [];
    names.forEach((name, i) => {
        retArr[i] = {
            columns: res.columns,
            data: []
        }
    });
    let lastIdx = names.length;
    retArr[lastIdx] = {
        columns: res.columns,
        data: []
    }
    res.data.forEach(function(row) {
        let i = names.indexOf(row[seq]);
        if (i !== -1) {
            retArr[i].data.push(row);
        } else {
            retArr[lastIdx].data.push(row);
        }
    });

    return retArr;
}