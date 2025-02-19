const Operation = {
    DELETE: 'DELETE',
    INSERT: 'INSERT',
    EQUAL: 'EQUAL'
};

function Diff(operation, text) {
    this.operation = operation;
    this.text = text;
}

function Compare(str1, str2) {
    this.words1 = this.splitWords(str1);
    this.words2 = this.splitWords(str2);
}

Compare.prototype.splitWords = function (str) {
    const result = [];
    const wordDelimiterRegex = /\S+/g;
    let match;

    while ((match = wordDelimiterRegex.exec(str)) !== null) {
        result.push(match[0]);
    }

    return result;
};

Compare.prototype.stringDiff = function () {
    const len1 = this.words1.length;
    const len2 = this.words2.length;
    const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (this.words1[i - 1] === this.words2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    const diffs = [];
    let i = len1, j = len2;

    while (i > 0 && j > 0) {
        if (this.words1[i - 1] === this.words2[j - 1]) {
            diffs.push(new Diff(Operation.EQUAL, this.words1[i - 1]));
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            diffs.push(new Diff(Operation.DELETE, this.words1[i - 1]));
            i--;
        } else {
            diffs.push(new Diff(Operation.INSERT, this.words2[j - 1]));
            j--;
        }
    }

    while (i > 0) {
        diffs.push(new Diff(Operation.DELETE, this.words1[i - 1]));
        i--;
    }
    while (j > 0) {
        diffs.push(new Diff(Operation.INSERT, this.words2[j - 1]));
        j--;
    }

    return diffs.reverse();
};

const compare = async (req, res) => {
    const {str1, str2} = req.body;
    if (!str1 || !str2) {
        return res.status(400).json({error: 'Invalid input'});
    }

    const result = [], diffs = new Compare(str1, str2).stringDiff();
    result.push(...diffs.map(item => [item.operation, item.text]));
    console.log('Comparing:', req.body, '->', JSON.stringify(result));
    res.json({result});
};

function addRoutes(app) {
    app.post('/compare', compare);
}

export default {addRoutes};
