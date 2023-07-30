import { useState } from 'react'
import FuzzySet from 'fuzzyset'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Grid, Button } from '@mui/material'

const Voice = (props) => {
    const [islistening, setIslistening] = useState(false)

    const Fuzzyfirstname = FuzzySet([
        'Posterior',
        'Echo',
        'Special',
        'Assoicated',
        'Surrounding',
        'Shape',
        'Orientation',
        'Margin',
        'Vascularity',
        'Elasticity',
        'Clock',
        'Distance',
        'Size',
    ])

    const Fuzzyname = FuzzySet([
        'Shape',
        'Orientation',
        'Margin',
        'EchoPattern',
        'PosteriorFeatures',
        'AssociatedFeatures',
        'Vascularity',
        'SurroundingChanges',
        'SpecialCases',
        'Calcifications',
        'Elasticity',
    ])

    const Fuzzyvalue = FuzzySet([
        'oval',
        'round',
        'irregualr',
        'parallel',
        'not_parallel',
        'circumscribed',
        'indistinct',
        'angular',
        'microbuate',
        'spiculated',
        'anechoic',
        'hyperechoic',
        'complex',
        'hypoechoic',
        'isoechoic',
        'no_psterior_acoustic_features',
        'enhancement',
        'shadowing',
        'combined_pattern',
        'duct_change',
        'skin_change_skin_thickening',
        'skin_change_skin_retraction',
        'vasculariry_absent',
        'vasculariry_internal_vascularity',
        'vasculariry_vesseles_in_rim',
        'duct_changes',
        'coopers_ligament_changes',
        'edema',
        'architectural_distortion',
        'skin_thickening',
        'skin_retraction_irregularity',
        'dclustered_microcysts',
        'complicated_cyst',
        'mass_in_or_on_skin',
        'foreign_body',
        'simple_cysts',
        'vascularabnormalities_avm',
        'vascularabnormalities_mondor_disease',
        'posturgical_fluid_collection',
        'fat_necrosis',
        'lymph_nodes_itramammary',
        'lymph_nodes_axillary',
        'intraductal',
        'microcalcifications_out_of_mass',
        'microcalcifications_in_mass',
        'not_assessed',
        'soft',
        'intermediate',
        'hard',
    ])

    const englishToNumber = (word) => {
        switch (word) {
            case 'zero':
                return 0
            case 'one':
                return 1
            case 'two':
                return 2
            case 'three':
                return 3
            case 'four':
                return 4
            case 'five':
                return 5
            case 'six':
                return 6
            case 'seven':
                return 7
            case 'eight':
                return 8
            case 'nine':
                return 9
            case 'ten':
                return 10
            case 'eleven':
                return 11
            case 'twelve':
                return 12
            default:
                return NaN
        }
    }

    const commands = [
        {
            command: 'Clock :value',
            callback: (value) => {
                if (isNaN(value)) {
                    const dot = englishToNumber(String(value).slice(0, -1))
                    props.setClock(dot)
                } else {
                    const dot = String(value).slice(0, -1)
                    props.setClock(dot)
                }
            },
        },
        {
            command: 'Distance :value',
            callback: (value) => {
                if (isNaN(value)) {
                    const dot = englishToNumber(String(value).slice(0, -1))
                    props.setDistance(dot <= props.CHESTMAXRADIUS ? dot : props.CHESTMAXRADIUS)
                } else {
                    const dot = String(value).slice(0, -1)
                    props.setDistance(dot <= props.CHESTMAXRADIUS ? dot : props.CHESTMAXRADIUS)
                }
            },
        },
        {
            command: 'Size :value',
            callback: (value) => {
                if (isNaN(value)) {
                    const dot = englishToNumber(String(value).slice(0, -1))
                    const s = dot * 1
                    props.setSize(s <= props.TUMORMAXSIZE ? s : props.TUMORMAXSIZE)
                } else {
                    const dot = String(value).slice(0, -1)
                    const s = dot * 1
                    props.setSize(s <= props.TUMORMAXSIZE ? s : props.TUMORMAXSIZE)
                }
            },
        },
        {
            command: ':name :value',
            callback: (name, value) => {
                const Aname = Fuzzyname.get(name)[0]
                const Avalue = Fuzzyvalue.get(value)[0]
                if (Aname[0] >= 0.4) {
                    var rname = Aname[1]
                }
                if (Avalue[0] >= 0.4) {
                    var rvalue = Avalue[1]
                }
                if (value) {
                    props.setForm([...props.form, { key: rname, value: rvalue }])
                } else {
                    const tmpForm = props.form.filter((f) => f.key !== rname)
                    props.setForm([...tmpForm])
                }
            },
        },
        {
            command: '* * *',
            callback: (name1, name2, value1) => {
                const firstName = Fuzzyfirstname.get(name1)[0]
                console.log(firstName)
                if (firstName[0] >= 0.4) {
                    name1 = firstName[1]
                }
                if (
                    name1 === 'Posterior' ||
                    name1 === 'Special' ||
                    name1 === 'Echo' ||
                    name1 === 'Assoicated' ||
                    name1 === 'Surrounding'
                ) {
                    var name = name1 + name2
                    var value = value1
                } else {
                    var name = name1
                    var value = name2 + value1
                }
                const Aname = Fuzzyname.get(name)[0]
                const Avalue = Fuzzyvalue.get(value)[0]
                if (Aname[0] >= 0.4) {
                    var rname = Aname[1]
                }
                if (Avalue[0] >= 0.4) {
                    var rvalue = Avalue[1]
                }
                if (value) {
                    props.setForm([...props.form, { key: rname, value: rvalue }])
                } else {
                    const tmpForm = props.form.filter((f) => f.key !== rname)
                    props.setForm([...tmpForm])
                }
            },
        },
        // {
        //     command: '*',
        //     callback: (value) => {
        //         handleCheckKeywords(value)
        //     },
        // },
    ]

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
        commands,
    })

    const handleVoiceInput = () => {
        setIslistening(!islistening)
        if (!browserSupportsSpeechRecognition) {
            window.alert('Browser does not support speech recognition')
        }

        if (islistening === true) {
            SpeechRecognition.stopListening()
        } else if (islistening === false) {
            SpeechRecognition.startListening({ continuous: true })
            resetTranscript()
        }
    }

    // const getFollowingWords = (value, keywords) => {
    //     const words = value.toLowerCase().split(' ')

    //     const results = {}

    //     for (let i = 0; i < words.length - 1; i++) {
    //         const currentWord = words[i]

    //         let fuzzyResult = Fuzzyfirstname.get(currentWord)
    //         if (fuzzyResult === null) {
    //             fuzzyResult = [] // 將 null 設為空陣列
    //         }

    //         if (fuzzyResult.length > 0 && fuzzyResult[0][0] >= 0.4) {
    //             const updatedWord = fuzzyResult[0][1] // 使用新的變數來存儲模糊查詢後的結果

    //             for (const keyword of keywords) {
    //                 if (updatedWord === keyword) {
    //                     // 找到關鍵詞後，依次捕捉相同或相似的詞語
    //                     let followingWords = [words[i + 1]]
    //                     let j = i + 2
    //                     while (j < words.length) {
    //                         const nextWord = words[j]
    //                         const nextFuzzyResult = Fuzzyfirstname.get(nextWord)
    //                         if (nextFuzzyResult === null) {
    //                             break
    //                         }
    //                         const nextUpdatedWord = nextFuzzyResult[0][1]
    //                         if (keywords.includes(nextUpdatedWord)) {
    //                             break
    //                         }
    //                         followingWords.push(nextWord)
    //                         j++
    //                     }
    //                     results[keyword] = followingWords.join(' ')
    //                     break
    //                 }
    //             }
    //         }
    //     }
    //     return results
    // }

    // const handleCheckKeywords = (value) => {
    //     const keywordsToCheck = ['Clock', 'Distance', 'Size', 'Shape', 'Vascularity']

    //     const followingWords = getFollowingWords(value, keywordsToCheck)

    //     console.log(followingWords)
    // }

    return (
        <Grid container spacing={4}>
            <Button sx={{ fontSize: '1.1rem' }} onClick={handleVoiceInput}>
                <KeyboardVoiceIcon style={listening ? { color: 'red' } : { color: 'cadetblue' }} />
            </Button>
            <p>{transcript}</p>
        </Grid>
    )
}

export default Voice
