import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth } from '../firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    db: firestore,
    auth: auth,
    people: null,
    familyTree: {},
    lines: null,
    session: {
      'login': null,
      'alias': null,
      'uid': null,
      'email': null
    },
    panZoom: true
  },
  mutations: {
    storePeopleData: (state, val) => {
      state.people = val
    },
    storeFamilyTreeData: (state, val) => {
      state.familyTree = createTreeObj(val)

      function createTreeObj (objectP) {
        let flyCount = 1
        let usedObject = {}
        let treObject = {
          'familia': {
            'couple': []
          }
        }
  
        const lowestRow = objectP[Object.keys(objectP)[0]].row
  
        // loop en todos los elementos como llegan de firebase
        for (let key in objectP) {
          // si es = a lowest row
          if (objectP[key].row === lowestRow) {
            // console.log(objectP[key].name + " lowest ROW");
  
            agregarTreeObject(treObject, '', key, true)
  
            usedObject[key] = []
            usedObject[key].push('familia')
          } else {
            // si encuentra mother en usados
            if (findUsed(objectP[key].conections.mother)) {
              let mother = objectP[key].conections.mother
              // console.log(objectP[key].name + " MOTHER: " + objectP[mother].name);
  
              let newPath = usedObject[mother][0] + '.relatives.familia' + (flyCount + 1)
              agregarTreeObject(treObject, usedObject[mother][0], key, 'familia' + (flyCount + 1), true)
              // agrego key a usados
              usedObject[key] = []
              usedObject[key].push(newPath)
            
            // si encuentra father in usados
            } else if (findUsed(objectP[key].conections.father)) {
              let father = objectP[key].conections.father
              // console.log(objectP[key].name + " FATHER: " + objectP[father].name);
  
              let newPath = usedObject[father][0] + '.relatives.familia' + (flyCount + 1)
              agregarTreeObject(treObject, usedObject[father][0], key, 'familia' + (flyCount + 1), true)
  
              // agrego key a usados
              usedObject[key] = []
              usedObject[key].push(newPath)
            }
          }
        }
  
        for (let key in objectP) {
          // console.log("***PERSONA C: " + objectP[key].name);
          if (!usedObject[key]) {
            // si encuentra spouse in usados
            if (findUsed(objectP[key].conections.spouse)) {
              let spouse = objectP[key].conections.spouse
              // console.log(objectP[key].name + " SI encontre SPOUSE: " + objectP[spouse].name);
  
              agregarTreeObject(treObject, usedObject[spouse][0], key)
              usedObject[key] = []
              usedObject[key].push(usedObject[spouse][0])
            }
          }
        }
  
        return treObject
  
        function findUsed (key) {
          let usados = Object.keys(usedObject)
          let resultado = false
          for (var i = 0; i < usados.length; i++) {
            if (usados[i] === key) {
              resultado = true
            }
          }
          return resultado
        }
  
        function agregarTreeObject (obj, path, key, familyId = false, relation = false) {
          // separa el string en un array
          // console.log("path: " + path);
          let parts = path.split('.')
          // console.log(parts);
  
          // si el array tiene un solo valor
          if (parts.length === 1) {
            if (parts[0] === '') {
              obj.familia.couple.push(key)
              return true
            
            // si relation es true(realtive)
            } else if (relation) {
              let familyObj = parts[0]
              // console.log(obj[familyObj]);
  
              if (!obj[familyObj].relatives) {
                // creo una propiedad 'relatives' en el objeto provisional
                obj[familyObj].relatives = {}
              }
              // dentro de 'relatives' creo una propiedad 'family#' basada en el counter
              obj[familyObj].relatives[familyId] = {}
              // dentro de 'family#' creo una propiedad 'couple' como array
              obj[familyObj].relatives[familyId].couple = []
              // y le agrego a 'couple' el key
              obj[familyObj].relatives[familyId].couple.push(key)
              // ahora le sumo 1 a el caunter para el nombre de la familia
              flyCount = flyCount + 1
              // retorno para que pare la funcion
              return true
            
            // si relation es false(couple)
            } else {
              // al path le agrego el key al 'couple' al que pertenece. la pareja ya debe estar en el objProvicional
              obj[parts[0]].couple.push(key)
              // retorno para que pare la funcion
              return true
            }
          }
          // si 'path' tiene mas de un item se reinicia la misma funcion con un item menos pero con el objeto dentro de un nivel mas
          return agregarTreeObject(obj[parts[0]], parts.slice(1).join('.'), key, familyId, relation)
        }
      }
    },
    storeLinesData: (state, val) => {
      let linesObject = {}
      for (const key in val) {
        const personMom = val[key].conections.mother
        const personDad = val[key].conections.father
        
        // TODO change sintax
        if (personMom && personDad) {
          linesObject[key] = 'a' + personMom + personDad
        } else if (personMom) {
          linesObject[key] = 'a' + personMom
        } else if (personDad) {
          linesObject[key] = 'a' + personDad
        } else {
          linesObject[key] = null
        }
      }
      state.lines = linesObject
    },
    storeSessionData: (state, val) => {
      state.session = val
    },
    storePanZoom: (state, val) => {
      state.panZoom = val
    }
  },
  actions: {
    getData: ({ state, commit }) => {
      let dbObject = {}
      state.db
        .collection('people')
        .orderBy('row')
        .onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            dbObject[change.doc.id] = change.doc.data()
          })
          commit('storePeopleData', dbObject)
          commit('storeFamilyTreeData', dbObject)
          commit('storeLinesData', dbObject)
        })
    },
    sessionV: async ({ state, commit }) => {
      try {
        await state.auth.onAuthStateChanged(async user => {
          let userObjectP
          // User is logged in
          if (user) {
            try {
              const dbUsersResponse = await state.db.collection('users')
                .where('user_id', '==', user.uid)
                .get()
              dbUsersResponse.forEach(doc => {
                let userData = doc.data()
                userObjectP = {
                  'login': true,
                  'alias': userData.alias,
                  'uid': user.uid,
                  'email': user.email
                }
              })
            } catch (e) {
              // TODO display error
              console.error(e)
            }
          } else {
            // No user is signed in.
            userObjectP = {
              'login': false,
              'alias': null,
              'uid': null,
              'email': null
            }
          }
          commit('storeSessionData', userObjectP)
        })
      } catch (e) {
        // TODO display error
        console.error(e)
      }
    },
    panZoomChange: (context, val) => {
      context.commit('storePanZoom', val)
    }
  },
  getters: {
    genderSel: state => gender => {
      let people = state.people
      let objP = {}
      for (let key in people) {
        if (people.hasOwnProperty(key)) {
          if (people[key].sex === gender) {
            objP[key] = people[key]
          }
        }
      }
      return objP
    }
  }
})
