import { PluncAppInstance } from "../interface";
import { PlaceholderScope, Repeats } from "./types";



(()=>{
  // @ts-expect-error
  const app: PluncAppInstance = plunc.create('TestApp')
  app.component('Placeholders', (
    $scope: PlaceholderScope
  )=>{
    $scope.a = 'a'
    $scope.b = { a: 'a' }
    $scope.c = 2
    $scope.d = 4
    $scope.e = {
      a: 4,
      b: {
        a: 3
      }
    }
    $scope.f = () => 'a'
    $scope.g = {
      a: () => 'a',
      b: (num) => num * $scope.d,
      c: {
        a:(arg1,arg2)=> arg1+''+arg2
      }
    }
    return {}
  })


  app.component('Repeats', ($scope: Repeats)=>{
    $scope.a = [{a:'a'},{a:'b'},{a:'c'}]
    $scope.b = 4
  })
})();