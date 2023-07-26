import { useState } from 'react'
import FuzzySet from 'fuzzyset'
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Grid, Button } from '@mui/material'

const Voice = (props) => {
    const [islistening, setIslistening] = useState(false)
    const [recognizedText, setRecognizedText] = useState('')

    const set = FuzzySet([
        'Shape',
        'oval',
        'round',
        'irregualr',
        'Orientation',
        'parallel',
        'not_parallel',
        'Margin',
        'circumscribed',
        'indistinct',
        'angular',
        'microbuate',
        'spiculated',
        'EchoPattern',
        'anechoic',
        'hyperechoic',
        'complex',
        'hypoechoic',
        'isoechoic',
        'PosteriorFeatures',
        'no_psterior_acoustic_features',
        'enhancement',
        'shadowing',
        'combined_pattern',
        'AssociatedFeatures',
        'duct_change',
        'skin_change_skin_thickening',
        'skin_change_skin_retraction',
        'Vascularity',
        'vasculariry_absent',
        'vasculariry_internal_vascularity',
        'vasculariry_vesseles_in_rim',
        'SurroundingChanges',
        'duct_changes',
        'coopers_ligament_changes',
        'edema',
        'architectural_distortion',
        'skin_thickening',
        'skin_retraction_irregularity',
        'SpecialCases',
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
        'Calcifications',
        'intraductal',
        'microcalcifications_out_of_mass',
        'microcalcifications_in_mass',
        'Elasticity',
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
            command: '* * *',
            callback: (name1, name2, value) => {
                console.log('1')
                name2 = name2.replace(/,/g, '')
                const name = name1 + name2
                const Aname = set.get(name)[0]
                const Avalue = set.get(value)[0]
                if (Aname[0] >= 0.4) {
                    var rname = Aname[1]
                }

                if (Avalue[0] >= 0.4) {
                    var rvalue = Avalue[1]
                }
                console.log(rname, rvalue)
                if (value) {
                    props.setForm([...props.form, { key: rname, value: rvalue }])
                } else {
                    const tmpForm = props.form.filter((f) => f.key !== rname)
                    props.setForm([...tmpForm])
                }
            },
        },
        {
            command: ':name *',
            callback: (name, value) => {
                console.log('2')
                const Aname = set.get(name)[0]
                const Avalue = set.get(value)[0]
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
