import React, {useEffect, useState} from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

export default () =>{

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData]= useState(null);
  const [blackHeader, setblackHeader]= useState(false);

  useEffect(()=>{
    const load = async () => {
      const list = await Tmdb.getHomeList();
      setMovieList(list);

      const originals =  await list.filter(i=> i.slug === 'originals');
      const randonChosen = await Math.floor(Math.random() * (originals[0].items.results.length - 1));
      const chosen = await originals[0].items.results[randonChosen]
      const chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    load();
  }, []);

  useEffect(()=>{
    const scrollListener = () =>{
        if(window.scrollY > 10){
          setblackHeader(true);
        }else{
          setblackHeader(false);
        }
    }

    window.addEventListener('scroll', scrollListener);

    return () =>{
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);

  return(
    <div className="page">

      <Header black={blackHeader}/>

      {featuredData && 
        <FeaturedMovie item ={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key) =>(
          <MovieRow key={key} title={item.title} items={item.items}></MovieRow>
        ))

        }
      </section>
      <footer>
        Todos os direitos das imagens são da Netflix.<br/>
        Dados Extraidos do site Themoviedb.org<br/>
        Feito por <strong> Vitoria Felix </strong>
      </footer>


    {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
      </div>
    }
    </div>
  )
}


