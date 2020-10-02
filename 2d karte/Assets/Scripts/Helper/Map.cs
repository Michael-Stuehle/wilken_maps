using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Assets.Scripts.Helper
{
    public class Map<TKey, TValue> : IEnumerable
    {
        private List<KeyValuePair<TKey, TValue>> items;
  
        public Map()
        {
            items = new List<KeyValuePair<TKey, TValue>>();
        }

        public Map(params Map<TKey, TValue>[] maps): this(){
            foreach (var map in maps)
            {
                foreach (var item in map)
                {
                    Add(item.Key, item.Value);
                }
            }
        }

        public bool ContainsKey(TKey key)
        {
            return Keys.Contains(key);
        }

        public List<TKey> Keys
        {
            get
            {
                List<TKey> keys = new List<TKey>();
                foreach (var item in items)
                {
                    keys.Add(item.Key);
                }
                return keys;
            }
        }

        public List<TValue> Values
        {
            get
            {
                List<TValue> values = new List<TValue>();
                foreach (var item in items)
                {
                    values.Add(item.Value);
                }
                return values;
            }
        }

        public void Add(TKey key, TValue value)
        {
            items.Add(new KeyValuePair<TKey, TValue>( key, value ));
        }

        public int IndexOf(TKey key)
        {
            for (int i = 0; i < items.Count; i++)
            {
                if (items[i].Key.Equals(key))
                {
                    return i;
                }
            }
            return -1;
        }

        public bool TryGetValue(TKey key, out TValue value)
        {
            int index = IndexOf(key);
            bool retVal = index != -1;
            if (retVal)
            {
                value = Values[index];
            }
            else
            {
                value = default(TValue);
            }
            
            return retVal;
        }


        IEnumerator IEnumerable.GetEnumerator()
        {
            return (IEnumerator)GetEnumerator();
        }

        public MapEnum<TKey, TValue> GetEnumerator()
        {
            return new MapEnum<TKey, TValue>(items.ToArray());
        }

        public List<TValue> FindAll(TKey Key)
        {
            List<TValue> lst = new List<TValue>();
            foreach (var item in items)
            {
                if (item.Key.Equals(Key))
                {
                    lst.Add(item.Value);
                }
            }
            return lst;
        }

        public TValue this[TKey key]
        {
            get
            {
                int index = IndexOf(key);
                if (index >= 0)
                {
                    return items[index].Value;
                }
                return default(TValue);
            }
            set
            {
                int index = IndexOf(key);
                if (index >= 0)
                {
                    items[index] = new KeyValuePair<TKey, TValue>(key, value);
                }
                else
                {
                    throw new KeyNotFoundException("der key: " + key.ToString() + " ist nicht vorhanden");
                }
            }
        }

        public static Map<TKey, TValue> operator +(Map<TKey, TValue> map1, Map<TKey, TValue> map2)
        {
            Map<TKey, TValue> result = new Map<TKey, TValue>();
            foreach (var item in map1)
            {
                result.Add(item.Key, item.Value);
            }
            foreach (var item in map2)
            {
                result.Add(item.Key, item.Value);
            }
            return result;
        }

        public override string ToString()
        {
            string ret = "";
            foreach (var item in this)
            {
                ret += item.Key.ToString() + "=" + item.Value.ToString() + "\r\n";
            }
            return ret;
        }
    }
}
