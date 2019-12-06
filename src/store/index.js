import Vue from 'vue'
import Vuex from 'vuex'
import { firestore, auth, storage } from '../firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    db: firestore,
    auth: auth,
    storage: storage,
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
    storeFamilyTreeData: (state, objectP) => {
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
          agregarTreeObject(treObject, '', key, true)
          usedObject[key] = 'familia'
        } else {
          const nextFlyCount = flyCount + 1
          // si encuentra mother en usados
          if (objectP[key].conections.mother in usedObject) {
            const mother = objectP[key].conections.mother
            agregarTreeObject(treObject, usedObject[mother], key, `familia${nextFlyCount}`, true)
            // agrego key a usados
            usedObject[key] = usedObject[mother] + `.relatives.familia${nextFlyCount}`
          
          // si encuentra father in usados
          } else if (objectP[key].conections.father in usedObject) {
            let father = objectP[key].conections.father
            agregarTreeObject(treObject, usedObject[father], key, `familia${nextFlyCount}`, true)
            // agrego key a usados
            usedObject[key] = usedObject[father] + `.relatives.familia${nextFlyCount}`
          }
        }
      }

      for (let key in objectP) {
        // estoy buscando los que no se han usado (no pertenecen a la familia directa)
        if (key in usedObject) continue
        const spouse = objectP[key].conections.spouse
        // ahora buscamos al spaouse en los usados 
        if (spouse in usedObject) {
          agregarTreeObject(treObject, usedObject[spouse], key)
          usedObject[key] = usedObject[spouse]
        }
      }

      state.familyTree = treObject

      function agregarTreeObject (obj, path, key, familyId, relation = false) {
        // separa el string en un array
        const parts = path.split('.')
        // si el array tiene un solo valor
        if (parts.length === 1) {
          const lastpath = parts[0]
          if (lastpath === '') {
            obj.familia.couple.push(key)
          } else if (relation) { // si relation es true(realtive)            
            if (!('relatives' in obj[lastpath])) {
              // creo una propiedad 'relatives' en el objeto provisional
              obj[lastpath].relatives = {}
            }
            // dentro de 'relatives' creo una propiedad 'family#' basada en el counter
            obj[lastpath].relatives[familyId] = {}
            // dentro de 'family#' creo una propiedad 'couple' como array
            obj[lastpath].relatives[familyId].couple = []
            // y le agrego a 'couple' el key
            obj[lastpath].relatives[familyId].couple.push(key)
            // ahora le sumo 1 a el caunter para el nombre de la familia
            flyCount = flyCount + 1
          } else if (!relation) { // si relation es false(couple)
            // al path le agrego el key al 'couple' al que pertenece. la pareja ya debe estar en el objProvicional
            obj[lastpath].couple.push(key)
          }
        } else {
          // si 'path' tiene mas de un item se reinicia la misma funcion con un item menos pero con el objeto dentro de un nivel mas
          agregarTreeObject(obj[parts[0]], parts.slice(1).join('.'), key, familyId, relation)
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
      state.db
        .collection('people')
        .orderBy('row')
        .onSnapshot(snapshot => {
          let dbObject = {}
          snapshot.docs.forEach(doc => {
            dbObject[doc.id] = doc.data()
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
    getPersonById: state => id => {
      return state.people[id]
    },
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
